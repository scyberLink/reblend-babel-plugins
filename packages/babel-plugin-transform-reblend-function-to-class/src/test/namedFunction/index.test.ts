import { run } from "../testUtils";

test("Should be able to transpile named function", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
