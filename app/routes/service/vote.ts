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

export const schema = z.object({
  like: z.enum(voteKey),
})

export const action: ActionFunction = async ({context, request}) => {
  const {remix_cloudflare_pages_kv} = context
  const mutation = makeDomainFunction(schema)(async values => {
    const {like} = values
    const pageCached = await remix_cloudflare_pages_kv.get<Partial<PageData>>(pageCacheKey, 'json')
    const updateData: Partial<PageData> = {
      ...pageCached,
      voteData: {
        ...(pageCached?.voteData ?? defaultVoteData),
        [like]: pageCached?.voteData ? pageCached.voteData[like] + 1 : 1,
      },
    }
    await remix_cloudflare_pages_kv.put(pageCacheKey, JSON.stringify(updateData))
  })

  return await formAction({
    request,
    schema: schema,
    mutation,
    successPath: '/',
  })
}

export const useData = () => {
  const pageData = useLoaderData<PageData>()
  return pageData
}

export const loader: LoaderFunction = async ({context}): Promise<PageData> => {
  const {remix_cloudflare_pages_kv} = context

  const pageCached = await remix_cloudflare_pages_kv.get<Partial<PageData>>(pageCacheKey, 'json')
  const pageData: PageData = {
    ...pageCached,
    viewCount: pageCached?.viewCount ?? 1,
    voteData: pageCached?.voteData ?? defaultVoteData,
  }
  return pageData
}
