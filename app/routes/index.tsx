import {Link} from '@remix-run/react'
import {Form} from 'remix-forms'

import * as vote from '~/service/vote'

const Page = () => {
  const {viewCount, voteData} = vote.useData()

  return (
    <div>
      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Welcome to Remix
      </h1>
      <p>表示回数: {viewCount ?? '0'}</p>
      <p>たけのこの里: {voteData.takenoko ?? '0'}</p>
      <p>きのこの里: {voteData.kinoko ?? '0'}</p>
      <Form schema={vote.schema} />
      <Link to={'/posts/first-post'}>mdx page: first-post</Link>
    </div>
  )
}

export default Page
export const loader = vote.loader
export const action = vote.action
