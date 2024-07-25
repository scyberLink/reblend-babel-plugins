import { run } from "../testUtils";

test("Should correctly map computed object property", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
