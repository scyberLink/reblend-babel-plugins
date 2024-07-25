import { run } from "../testUtils";

test("Should transpile to Reblend class in a default export", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
