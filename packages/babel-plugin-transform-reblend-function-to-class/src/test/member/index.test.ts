import { run } from "../testUtils";

test("Should be able to map identifier to function body declarations", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
