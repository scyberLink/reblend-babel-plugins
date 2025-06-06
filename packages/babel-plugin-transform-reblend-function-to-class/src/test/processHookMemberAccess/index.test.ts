import { run } from "../testUtils";

test("Should be able to bind this to cjs called reblend hooks ", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
