import { run } from "../testUtils";

test("Should be able to transpile regular function", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
