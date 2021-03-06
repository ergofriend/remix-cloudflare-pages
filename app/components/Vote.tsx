import {Form} from 'remix-forms'
import {Controller} from 'react-hook-form'

import * as vote from '~/service/vote'
import {CardList} from './CardList'

export const Vote = () => {
  const {viewCount, voteData} = vote.useData()

  return (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="font-medium leading-tight text-3xl mt-0 mb-2 text-black-600">Which do u like?</h3>
      <p>total views: {viewCount ?? '0'}</p>
      <CardList votes={[voteData.kinoko, voteData.takenoko]} />
      <Form schema={vote.schema} className="flex justify-center gap-4">
        {({Field, Errors, Button, control}) => (
          <>
            <Field name="like">
              {({Errors}) => (
                <Controller
                  control={control}
                  name="like"
                  render={({field: {onChange}}) => {
                    return (
                      <div className="flex justify-center gap-10">
                        <div className="form-check form-check-inline">
                          <input
                            onChange={onChange}
                            type="radio"
                            name="like"
                            id="kinoko"
                            value="kinoko"
                            className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          />
                          <label htmlFor="kinoko" className="form-check-label inline-block text-gray-800">
                            左に投票
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            onChange={onChange}
                            type="radio"
                            name="like"
                            id="takenoko"
                            value="takenoko"
                            className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          />
                          <label htmlFor="takenoko" className="form-check-label inline-block text-gray-800">
                            右に投票
                          </label>
                        </div>
                        <Errors />
                      </div>
                    )
                  }}
                />
              )}
            </Field>
            <Errors />
            <Button className="disabled:opacity-50">
              <div className="relative inline-block text-lg group">
                <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                  <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                  <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                  <span className="relative">投票する</span>
                </span>
                <span
                  className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                  data-rounded="rounded-lg"
                ></span>
              </div>
            </Button>
          </>
        )}
      </Form>
    </div>
  )
}
