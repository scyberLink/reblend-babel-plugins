import { run } from "../testUtils";

test("Should transpile to Reblend class", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
