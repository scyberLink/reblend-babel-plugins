import { run } from "../testUtils";

test("Should transpile file of multiple exports", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
