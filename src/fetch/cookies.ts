import type { IRequest, IResponse } from "..";

export function setCookiesToRequest(req: IRequest) {
  if (!req.cookieJar) {
    return;
  }

  const cookieString = Array.from(req.cookieJar.entries())
    .map(
      ([name, value]) =>
        encodeURIComponent(name) + "=" + encodeURIComponent(value),
    )
    .join("; ");

  if (cookieString.length > 0) {
    req.headers = {
      ...req.headers,
      Cookie: cookieString,
    };
  }
}

export function setCookiesFromResponse(
  req: IRequest,
  bunResp: Awaited<ReturnType<typeof Bun.fetch>>,
) {
  if (!req.cookieJar) {
    return;
  }

  for (const setCookieString of bunResp.headers.getSetCookie()) {
    req.cookieJar.set(Bun.Cookie.parse(setCookieString));
  }
}
