# zod-extras

Extra utilities for creating a [Zod](https://zod.dev) schema.

## `zformdata`

Create a schema just like using `z.object()`, but it will parse a `FormData` object.

```js
import { zformdata } from "zod-extras";

const schema = zformdata({
  login: z.string().min(6),
  email: z.string().email()
});

const data = schema.parse(formData);
```

## `zjsonstring`

Pass a Zod schema and it will validate the argument is a valid JSON string and pipe the parsed value to the schema.

It can also be used without arguments and it will simply validate and parse the string.

```js
import { zjsonstring } from "zod-extras";

const configJson = zjsonstring(
  z.object({
    run: z.boolean()
  })
);

const config = configJson.parse('{"run": true}');
```

```js
import { zjsonstring } from "zod-extras";

const configJson = zjsonstring().pipe(
  z.object({
    run: z.boolean()
  })
);

const config = configJson.parse('{"run": true}');
```

## License

MIT
