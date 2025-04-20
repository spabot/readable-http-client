# readable-http-client

Declarative http client for use against unpredictable http servers.

## Installation

```bash
bun add readable-http-client
```

## Example

I recommend you to use [typia](https://github.com/samchon/typia)

```typescript
import { fetch, handlers } from 'readable-http-client'
import typia, { type tags } from 'typia'

// In case no handlers matches the response, UnhandledResponseError is thrown
// who contains the request and response.

const ipAddress: string = await fetch({
    request: {
        url: 'https://ip.oxylabs.io/location',
        method: 'GET'
    },
    handlers: [
        handlers.is({
            headers: typia.createValidate<{
                ":code": 200,
                data: {
                    "content-type": "application/json"
                }
            }>(),
            body: typia.json.createIsParse<{
                ip: string & (tags.Format<'ipv4'> | tags.Format<'ipv6'>)
            }>(),
            handle(resp) {
                return resp.body.ip
            }
        })
    ]
})

console.info("My public IP address is:", ipAddress)
```

## Appendix

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
