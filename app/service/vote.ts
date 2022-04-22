import {createCookieSessionStorage} from '@remix-run/cloudflare'
import {useLoaderData} from '@remix-run/react'
import {json} from '@remix-run/server-runtime'
import {makeDomainFunction} from 'remix-domains'
import {formAction} from 'remix-forms'
import Toucan from 'toucan-js'
import {z} from 'zod'

const {getSession, commitSession} = createCookieSessionStorage({
  cookie: {
    name: 'vote',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    // TODO: read from ENV
    secrets: ['cookie_secret'],
  },
})

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
  const newData = new URLSearchParams(formData.entries() as unknown as URLSearchParams).toString()
  const json = JSON.stringify(Object.fromEntries(formData.entries()))
  const log = `action data: ${data} newData: ${newData} json: ${json}`
  console.log(log)
  sentry.captureMessage(log)

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

    const session = await getSession(request.headers.get('Cookie'))
    const isVoted = session.get('isVoted') as boolean
    !isVoted && session.set('isVoted', true)
    return values
  })

  return await formAction({
    request,
    schema,
    mutation,
    // formAction は beforeAction が設定されたことで early-return している
    // formAction を使っている意味は無いが、問題が修正されたら戻したい
    // https://github.com/SeasonedSoftware/remix-domains/issues/18
    // https://github.com/SeasonedSoftware/remix-forms/blob/main/src/formAction.server.ts#L67
    // mutation: (() => {}) as any,
    // beforeAction: async req => {
    //   const formData = await req.clone().formData()
    //   const values = Object.fromEntries(formData.entries()) as z.infer<typeof schema>
    //   sentry.captureMessage(`action: ${JSON.stringify(values)}`)

    //   const {like} = values
    //   const pageCached = await getData(context.env)
    //   const updateData: PageData = {
    //     ...pageCached,
    //     voteData: {
    //       ...pageCached.voteData,
    //       [like]: pageCached.voteData[like] + 1,
    //     },
    //   }
    //   await setData(context.env, updateData)

    //   const session = await getSession(req.headers.get('Cookie'))
    //   const isVoted = session.get('isVoted') as boolean
    //   !isVoted && session.set('isVoted', true)
    //   return json(values, {
    //     headers: {
    //       'Set-Cookie': await commitSession(session),
    //     },
    //   })
    // },
  })
}

export const useData = () => {
  const pageData = useLoaderData<PageData>()
  return pageData
}

export const loader: LoaderFunction = async ({context, request}): Promise<PageData> => {
  const pageCached = await getData(context.env)
  const session = await getSession(request.headers.get('Cookie'))
  const isVoted = session.get('isVoted') as boolean
  if (!isVoted) await incrementViewCount(context, pageCached)
  return pageCached
}
