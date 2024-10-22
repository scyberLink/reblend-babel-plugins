import { run } from "../testUtils";

test("Should be able to map props argument or state variable when reassing 1", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
