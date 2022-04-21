import {createPagesFunctionHandler} from '@remix-run/cloudflare-pages'
import * as build from '@remix-run/dev/server-build'

const handleRequest = createPagesFunctionHandler({
  build,
  // eslint-disable-next-line no-undef
  mode: process.env.NODE_ENV,
  getLoadContext: context => context,
})

export function onRequest(context: Context) {
  return handleRequest(context)
}
