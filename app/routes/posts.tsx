import {Outlet} from '@remix-run/react'

const Page = () => {
  return (
    <div>
      blog
      <div className="flex justify-center">
        <div className="prose lg:prose-xl py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Page
