import type {FC} from 'react'
import {useMemo} from 'react'

import KinokoImage from '~/assets/kinoko.png'
import TakenokoImage from '~/assets/takenoko.png'
import type {VoteKey} from '~/service/vote'

type Props = {
  type: VoteKey
}

export const Card: FC<Props> = ({type}) => {
  const {src, alt} = useMemo(() => {
    if (type === 'kinoko') return {src: KinokoImage, alt: 'きのこの里'}
    return {src: TakenokoImage, alt: 'たけのこの里'}
  }, [type])

  return (
    <div className="rounded-lg overflow-hidden">
      <img height={200} width={200} src={src} alt={alt} />
    </div>
  )
}
