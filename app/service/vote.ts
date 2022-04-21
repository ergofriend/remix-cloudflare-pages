import {useLoaderData} from '@remix-run/react'
import {makeDomainFunction} from 'remix-domains'
import {formAction} from 'remix-forms'
import Toucan from 'toucan-js'
import {z} from 'zod'

const pageCacheKey = 'indexViewCount'

const voteKey = ['takenoko', 'kinoko'] as const

type VoteKey = typeof voteKey[number]

type VoteData = {
  [key in VoteKey]: number
}

type PageData = {
  viewCount: number
  voteData: VoteData
}

const defaultVoteData = {takenoko: 0, kinoko: 0}

const getData = async (env: ENV) => {
  const partialData = await env.remix_cloudflare_pages_kv.get<Partial<PageData>>(pageCacheKey, 'json')
  const data: PageData = {
    viewCount: partialData?.viewCount ?? 0,
    voteData: partialData?.voteData ?? defaultVoteData,
  }
  return data
}

const setData = async (env: ENV, updateData: PageData) =>
  await env.remix_cloudflare_pages_kv.put(pageCacheKey, JSON.stringify(updateData))

const incrementViewCount = async (ctx: Context, data: PageData) => {
  const updateData: PageData = {
    ...data,
    viewCount: data.viewCount + 1,
  }
  await setData(ctx.env, updateData)
}

export const schema = z.object({
  like: z.enum(voteKey),
})

export const action: ActionFunction = async ({context, request}) => {
  const sentry = new Toucan({
    dsn: context.env.SENTRY_DSN,
    context: context,
  })
  const formData = await request.clone().formData()
  const data = new URLSearchParams(formData as URLSearchParams).toString()
  const json = JSON.stringify(Object.fromEntries(formData.entries()))
  sentry.captureMessage(`action URLSearchParams: ${JSON.stringify(data)} json: ${json}`)

  const mutation = makeDomainFunction(schema)(async values => {
    sentry.captureMessage(`values: ${JSON.stringify(values)}`)

    const {like} = values
    const pageCached = await getData(context.env)
    const updateData: PageData = {
      ...pageCached,
      voteData: {
        ...pageCached.voteData,
        [like]: pageCached.voteData[like] + 1,
      },
    }
    await setData(context.env, updateData)
    return values
  })

  return await formAction({
    request,
    schema,
    mutation,
    successPath: '/?voted=true',
    beforeAction: async req => {
      try {
        const formData = await req.clone().formData()
        const data = new URLSearchParams(formData as URLSearchParams).toString()
        sentry.captureMessage(`{beforeAction: ${data}`)
      } catch (error) {
        sentry.captureMessage(`{beforeAction error: ${JSON.stringify(error)}`)
      }
    },
    beforeSuccess: async req => {
      try {
        const formData = await req.clone().formData()
        const data = new URLSearchParams(formData as URLSearchParams).toString()
        sentry.captureMessage(`{beforeSuccess: ${JSON.stringify(data)}`)
      } catch (error) {
        sentry.captureMessage(`{beforeSuccess error: ${JSON.stringify(error)}`)
      }
    },
  })
}

export const useData = () => {
  const pageData = useLoaderData<PageData>()
  return pageData
}

export const loader: LoaderFunction = async ({context, request}): Promise<PageData> => {
  const pageCached = await getData(context.env)
  if (!request.url.includes('voted')) await incrementViewCount(context, pageCached)
  return pageCached
}
