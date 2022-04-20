import {useLoaderData} from '@remix-run/react'
import {makeDomainFunction} from 'remix-domains'
import {formAction} from 'remix-forms'
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

const getData = async (ctx: Context) => {
  const partialData = await ctx.remix_cloudflare_pages_kv.get<Partial<PageData>>(pageCacheKey, 'json')
  const data: PageData = {
    viewCount: partialData?.viewCount ?? 0,
    voteData: partialData?.voteData ?? defaultVoteData,
  }
  return data
}

const setData = async (ctx: Context, updateData: PageData) =>
  await ctx.remix_cloudflare_pages_kv.put(pageCacheKey, JSON.stringify(updateData))

const incrementViewCount = async (ctx: Context, data: PageData) => {
  const updateData: PageData = {
    ...data,
    viewCount: data.viewCount + 1,
  }
  await setData(ctx, updateData)
}

export const schema = z.object({
  like: z.enum(voteKey),
})

export const action: ActionFunction = async ({context, request}) => {
  const mutation = makeDomainFunction(schema)(async values => {
    const {like} = values
    const pageCached = await getData(context)
    const updateData: PageData = {
      ...pageCached,
      voteData: {
        ...pageCached.voteData,
        [like]: pageCached.voteData[like] + 1,
      },
    }
    await setData(context, updateData)
    return values
  })

  return await formAction({
    request,
    schema,
    mutation,
    successPath: '/?voted=true',
  })
}

export const useData = () => {
  const pageData = useLoaderData<PageData>()
  return pageData
}

export const loader: LoaderFunction = async ({context, request}): Promise<PageData> => {
  const pageCached = await getData(context)
  if (!request.url.includes('voted')) await incrementViewCount(context, pageCached)
  return pageCached
}
