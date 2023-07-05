import { describe, test } from "node:test";
import * as assert from "node:assert";

import { zformdata, zjsonstring } from "../src/index.js";
import { z } from "zod";

describe("zformdata", () => {
  test("parses correctly", () => {
    const schema = zformdata({
      name: z.string(),
      city: z.enum(["New York", "Miami", "Sao Paulo"]),
      categories: z.array(z.string()),
      year: z.coerce.number()
    });

    const formData = new FormData();
    formData.append("name", "John Smith");
    formData.append("city", "New York");
    formData.append("categories", "Food");
    formData.append("year", "1991");

    const foo = schema.parse(formData);

    assert.deepEqual(schema.parse(formData), {
      name: "John Smith",
      city: "New York",
      categories: ["Food"],
      year: 1991
    });
  });

  test("supports catch", () => {
    const nonCatching = new FormData();
    nonCatching.append("key", "1");
    nonCatching.append("key", "2");

    const catching = new FormData();
    catching.append("key", "abc");
    catching.append("key", "def");

    assert.deepStrictEqual(
      zformdata({
        key: z.array(z.coerce.number()).catch([])
      }).parse(nonCatching),
      { key: [1, 2] }
    );

    assert.deepStrictEqual(
      zformdata({
        key: z.array(z.coerce.number()).catch([])
      }).parse(catching),
      { key: [] }
    );
  });

  test("supports effects", () => {
    const formData = new FormData();
    formData.append("login", "john");
    formData.append("cities", "New York");
    formData.append("cities", "Sao Paulo");

    assert.deepStrictEqual(
      zformdata({
        login: z.string().refine(val => val.length > 1),
        cities: z.array(z.string()).refine(val => val.length > 1)
      }).parse(formData),
      { login: "john", cities: ["New York", "Sao Paulo"] }
    );
  });

  test("supports pipeline", () => {
    const formData = new FormData();
    formData.append("key", "a");

    assert.deepStrictEqual(
      zformdata({
        key: z
          .array(z.any())
          .transform(val => val.length)
          .pipe(z.number().min(1))
      }).parse(formData),
      { key: 1 }
    );
  });
});

test("zjsonstring parses correctly", () => {
  assert.deepStrictEqual(
    zjsonstring(z.array(z.coerce.number())).parse('["0", "1", 2]'),
    [0, 1, 2]
  );
});
