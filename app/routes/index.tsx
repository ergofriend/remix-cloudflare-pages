import * as vote from '~/service/vote'
import {Tweet} from '~/components/Tweet'
import {Vote} from '~/components/Vote'

const Page = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Vote />
      <Tweet />
    </div>
  )
}

export default Page
export const loader = vote.loader
export const action = vote.action
