export class UnhandledResponseError extends Error {
  constructor(
    public request: IRequest,
    public response: IResponse,
  ) {
    super("Response is not handled.");
  }
}

export interface IRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string | string[]>;
  body?: string;
  proxy?: string;
  cookieJar?: Bun.CookieMap;
}

export interface IResponse {
  headers: {
    ":code": number;
    ":text": string;
    data: Record<string, string>;
  };
  downloadBody(): Promise<string>;
}

// Base interface for response handlers.
// Declarative handlers are available below.
export type IResponseHandler<T> = (resp: IResponse) => Promise<T | null>;

export interface IOptions<T> {
  request: IRequest;
  handlers: IResponseHandler<T>[];
}

export { fetch } from "./fetch";
export * as handlers from "./handlers";
