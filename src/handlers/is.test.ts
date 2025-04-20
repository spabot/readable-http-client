import { jest, expect, test } from "bun:test";
import { is } from "./is";
import type { IResponse } from "..";

const resp: IResponse = {
  headers: {
    ":code": 200,
    ":text": "OK",
    data: {},
  },
  downloadBody() {
    return Promise.resolve("here's the body");
  },
};

test("constructor does not call", () => {
  const headers = jest.fn();
  const body = jest.fn();
  const handle = jest.fn();

  is({ headers, body, handle });

  expect(headers).not.toBeCalled();
  expect(body).not.toBeCalled();
  expect(handle).not.toBeCalled();
});

test("call order", async () => {
  const headers = jest.fn(() => {
    expect(body).not.toBeCalled();
    expect(handle).not.toBeCalled();
    return {};
  });
  const body = jest.fn(() => {
    expect(headers).toBeCalled();
    expect(handle).not.toBeCalled();
    return "";
  });
  const handle = jest.fn(() => {
    expect(headers).toBeCalled();
    expect(body).toBeCalled();
    return true;
  });
  const handler = is({ headers, body, handle });

  expect(await handler(resp)).toBe(true);
});
