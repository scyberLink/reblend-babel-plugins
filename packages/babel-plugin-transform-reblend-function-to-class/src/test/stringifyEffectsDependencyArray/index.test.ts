import { run } from "../testUtils";

test("Should stringify effect function dependency", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
