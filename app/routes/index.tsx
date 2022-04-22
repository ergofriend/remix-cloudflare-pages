import {Form} from 'remix-forms'
import {Controller} from 'react-hook-form'

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
        <p>total views: {viewCount ?? '0'}</p>
        <div className="flex justify-around">
          <img height={200} width={200} src={TakenokoImage} alt="たけのこの里" />
          <img height={200} width={200} src={KinokoImage} alt="きのこの里" />
        </div>
        <div className="flex justify-around">
          <p>{voteData.takenoko ?? '0'}</p>
          <p>{voteData.kinoko ?? '0'}</p>
        </div>
        <p>どっちが好き？</p>
        <Form schema={vote.schema}>
          {({Field, Errors, Button, control}) => (
            <>
              <Field name="like">
                {({Errors}) => (
                  <Controller
                    control={control}
                    name="like"
                    render={({field}) => {
                      const {onChange, value} = field
                      return (
                        <div>
                          <p>{value}</p>
                          <input onChange={onChange} type="radio" name="like" id="takenoko" value="takenoko" />
                          <label htmlFor="takenoko">たけのこの里</label>
                          <input onChange={onChange} type="radio" name="like" id="kinoko" value="kinoko" />
                          <label htmlFor="kinoko">きのこの里</label>
                          <Errors />
                        </div>
                      )
                    }}
                  />
                )}
              </Field>
              <Errors />
              <Button>投票する</Button>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}

export default Page
export const loader = vote.loader
export const action = vote.action
