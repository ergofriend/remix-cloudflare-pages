import type {AppData, DataFunctionArgs} from '@remix-run/cloudflare'

declare global {
  type Context = {
    remix_cloudflare_pages_kv: KVNamespace
  }
  type LoaderFunction = (args: FunctionArgs) => FunctionResult
  type ActionFunction = (args: FunctionArgs) => FunctionResult
}

interface FunctionArgs extends Omit<DataFunctionArgs, 'context'> {
  context: Context
}

type FunctionResult = Promise<Response> | Response | Promise<AppData> | AppData
