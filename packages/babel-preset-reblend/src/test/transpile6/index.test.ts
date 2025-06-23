import { run } from "../testUtils";

test("Should handle wildcard import through default", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
