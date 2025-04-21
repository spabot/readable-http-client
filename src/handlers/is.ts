import type { IResponse, IResponseHandler } from "..";
import type { IValidation } from "typia";

export interface IResponseHandlerIs<
  T,
  Headers extends Partial<IResponse["headers"]>,
  Body extends unknown,
> {
  headers(input: IResponse["headers"]): IValidation<Headers>;
  body(input: string): Body | null;
  handle(resp: { headers: Headers; body: Body }): T | null;
}

export function is<
  T,
  Headers extends Partial<IResponse["headers"]>,
  Body,
>(opts: {
  headers(input: IResponse["headers"]): IValidation<Headers>;
  body(input: string): Body | null;
  handle(resp: IResponse & { headers: Headers; body: Body }): T | null;
}): IResponseHandler<T> {
  return async function (resp: IResponse) {
    const headers = opts.headers(resp.headers);
    if (!headers.success) return null;

    const body = opts.body(await resp.downloadBody());
    if (body === null) return null;

    return opts.handle({
      downloadBody: resp.downloadBody,
      headers: {
        ...resp.headers,
        ...headers.data,
        data: {
          ...resp.headers.data,
          ...headers.data.data,
        },
      },
      body,
    });
  };
}

export function is2<T, Headers extends Partial<IResponse["headers"]>>(opts: {
  headers(input: IResponse["headers"]): IValidation<Headers>;
  handle(resp: IResponse & { headers: Headers }): T | null;
}) {
  return function (resp: IResponse) {
    const headers = opts.headers(resp.headers);
    if (!headers.success) return null;

    return opts.handle({
      downloadBody: resp.downloadBody,
      headers: {
        ...resp.headers,
        ...headers.data,
        data: {
          ...resp.headers.data,
          ...headers.data.data,
        },
      },
    });
  };
}
