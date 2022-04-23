import type {FC} from 'react'
import {useState} from 'react'
import {Reorder} from 'framer-motion'

import type {VoteKey} from '~/service/vote'
import {Card} from './Card'

type Props = {
  votes: number[]
}

export const CardList: FC<Props> = ({votes}) => {
  const [items, setItems] = useState<Array<VoteKey>>(['kinoko', 'takenoko'])
  return (
    <Reorder.Group className="flex justify-center gap-4" as="div" axis="x" values={items} onReorder={setItems}>
      {items.map((item, i) => (
        <Reorder.Item key={item} value={item} as="div">
          <Card type={item} />
          <p>{votes[i]}</p>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
