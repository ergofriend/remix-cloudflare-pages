import type {AppData, DataFunctionArgs} from '@remix-run/cloudflare'

interface LoaderFunctionArgs extends Omit<DataFunctionArgs, 'context'> {
  context: {
    remix_cloudflare_pages_kv: KVNamespace
  }
}

type LoaderFunctionResult = Promise<Response> | Response | Promise<AppData> | AppData

declare global {
  type LoaderFunction = (args: LoaderFunctionArgs) => LoaderFunctionResult
}
