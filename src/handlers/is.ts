import type { IResponse, IResponseHandler } from "..";
import type { IValidation } from "typia";

export interface IResponseHandlerIs<
  T,
  Headers extends Partial<IResponse["headers"]>,
  Body extends unknown,
> {
  headers: (input: IResponse["headers"]) => IValidation<Headers>;
  body: (input: string) => Body | null;
  handle(resp: { headers: Headers; body: Body }): T | null;
}

export function is<T, Headers extends Partial<IResponse["headers"]>, Body>(
  opts: IResponseHandlerIs<T, Headers, Body>,
): IResponseHandler<T> {
  return async function (resp: IResponse) {
    const headers = opts.headers(resp.headers);
    if (!headers.success) return null;

    const body = opts.body(await resp.downloadBody());
    if (body === null) return null;

    return opts.handle({ headers: headers.data, body });
  };
}
