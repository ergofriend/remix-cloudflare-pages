import {Form} from 'remix-forms'

import * as vote from '~/service/vote'
import TakenokoImage from '~/assets/takenoko.png'
import KinokoImage from '~/assets/kinoko.png'
import {Tweet} from '~/components/Tweet'

const Page = () => {
  const {viewCount, voteData} = vote.useData()

  return (
    <div className="flex justify-around">
      <Tweet />
      <div className="flex flex-col">
        <p>表示回数: {viewCount ?? '0'}</p>
        <div className="flex justify-around">
          <img height={200} width={200} src={TakenokoImage} alt="たけのこの里" />
          <img height={200} width={200} src={KinokoImage} alt="きのこの里" />
        </div>
        <div className="flex justify-around">
          <p>{voteData.takenoko ?? '0'}</p>
          <p>{voteData.kinoko ?? '0'}</p>
        </div>
        <Form schema={vote.schema} />
      </div>
    </div>
  )
}

export default Page
export const loader = vote.loader
export const action = vote.action
