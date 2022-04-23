import {Reorder} from 'framer-motion'
import {useState} from 'react'

import type {VoteKey} from '~/service/vote'
import {Card} from './Card'

export const CardList = () => {
  const [items, setItems] = useState<Array<VoteKey>>(['kinoko', 'takenoko'])
  return (
    <Reorder.Group className="flex justify-around" as="div" axis="x" values={items} onReorder={setItems}>
      {items.map(item => (
        <Reorder.Item key={item} value={item} as="div">
          <Card type={item} />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
