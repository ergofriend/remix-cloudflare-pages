import {useLoaderData} from '@remix-run/react'

type PageCache = {
  viewCount: number
}

type LoaderData = {
  pageCache: PageCache
}

export const loader: LoaderFunction = async ({context}): Promise<LoaderData> => {
  const {remix_cloudflare_pages_kv} = context
  const pageCacheKey = 'indexViewCount'
  // ページビュー数を取得
  const pageCached = await remix_cloudflare_pages_kv.get<PageCache>(pageCacheKey, 'json')
  //  ページビュー数を更新
  const updatePageCache: PageCache = {
    ...pageCached,
    viewCount: (pageCached?.viewCount ?? 0) + 1,
  }
  await remix_cloudflare_pages_kv.put(pageCacheKey, JSON.stringify(updatePageCache))

  return {pageCache: updatePageCache}
}

export default function HomePage() {
  const {pageCache} = useLoaderData<LoaderData>()
  return (
    <div>
      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Welcome to Remix
      </h1>
      <p>表示回数: {pageCache.viewCount}</p>
    </div>
  )
}
