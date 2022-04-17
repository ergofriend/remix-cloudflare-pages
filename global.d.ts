import type {AppData, DataFunctionArgs as Args} from '@remix-run/cloudflare'

interface DataFunctionArgs extends Omit<Args, 'context'> {
  context: {
    remix_cloudflare_pages_kv: KVNamespace
  }
}

declare global {
  type LoaderFunction = (args: DataFunctionArgs) => Promise<Response> | Response | Promise<AppData> | AppData
}
