import { UnhandledResponseError, type IOptions, type IResponse } from "..";
import { setCookiesToRequest, setCookiesFromResponse } from "./cookies";

export async function fetch<T>(opts: IOptions<T>) {
  setCookiesToRequest(opts.request);

  const bunResp = await Bun.fetch(opts.request.url, {
    method: opts.request.method,
    headers: opts.request.headers,
    body: opts.request.body,
    proxy: opts.request.proxy,
    redirect: "manual",
  });

  setCookiesFromResponse(opts.request, bunResp);

  let body: string | undefined = undefined;
  const resp: IResponse = {
    headers: {
      ":code": bunResp.status,
      ":text": bunResp.statusText,
      data: bunResp.headers.toJSON(),
    },
    async downloadBody() {
      if (body) {
        return body;
      } else {
        return (body = await bunResp.text());
      }
    },
  };

  for (const handler of opts.handlers) {
    const result = await handler(resp);

    if (result !== null) {
      return result;
    }
  }

  throw new UnhandledResponseError(opts.request, resp);
}
