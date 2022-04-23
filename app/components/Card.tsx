import {FC, useMemo} from 'react'

import KinokoImage from '~/assets/kinoko.png'
import TakenokoImage from '~/assets/takenoko.png'
import type {VoteKey} from '~/service/vote'

type Props = {
  type: VoteKey
  vote: number
}

export const Card: FC<Props> = ({type, vote}) => {
  const {src, alt} = useMemo(() => {
    if (type === 'kinoko') return {src: KinokoImage, alt: 'きのこの里'}
    return {src: TakenokoImage, alt: 'たけのこの里'}
  }, [type])

  return (
    <div className="static rounded-lg overflow-hidden pointer-events-none">
      <div className="absolute">
        <div className="rounded-lg bg-white m-2 p-3">{vote}</div>
      </div>
      <img className="" height={200} width={200} src={src} alt={alt} />
    </div>
  )
}
