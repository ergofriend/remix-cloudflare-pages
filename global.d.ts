import type {AppData, DataFunctionArgs} from '@remix-run/cloudflare'

interface Args extends Omit<DataFunctionArgs, 'context'> {
  context: {
    remix_cloudflare_pages_kv: KVNamespace
  }
}

declare global {
  type LoaderFunction = (args: Args) => Promise<Response> | Response | Promise<AppData> | AppData
}
