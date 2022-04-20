import {useLoaderData} from '@remix-run/react'
import {makeDomainFunction} from 'remix-domains'
import {formAction} from 'remix-forms'
import {z} from 'zod'

const pageCacheKey = 'indexViewCount'

const voteKey = ['takenoko', 'kinoko'] as const

type VoteKey = typeof voteKey[number]

type PageCache = {
  [key in VoteKey]: number
}

type LoaderData = {
  pageCache: PageCache
}

const defaultVoteData = {takenoko: 0, kinoko: 0}

export const schema = z.object({
  like: z.enum(voteKey),
})

export const action: ActionFunction = async ({context, request}) => {
  const {remix_cloudflare_pages_kv} = context
  const mutation = makeDomainFunction(schema)(async values => {
    const {like} = values
    const pageCached = (await remix_cloudflare_pages_kv.get<PageCache>(pageCacheKey, 'json')) ?? defaultVoteData
    const updateData = {
      ...pageCached,
      [like]: pageCached ? pageCached[like] + 1 : 1,
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
  const {pageCache} = useLoaderData<LoaderData>()
  return pageCache
}

export const loader: LoaderFunction = async ({context}): Promise<LoaderData> => {
  const {remix_cloudflare_pages_kv} = context

  const pageCached = await remix_cloudflare_pages_kv.get<PageCache>(pageCacheKey, 'json')
  return {pageCache: pageCached ?? defaultVoteData}
}
