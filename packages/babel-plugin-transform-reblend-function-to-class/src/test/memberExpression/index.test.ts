import { run } from "../testUtils";

test("Should be able to map spread argument to props member function in Arrow Function Expression", () => {
  const { outputCode, expectedOutputCode } = run(__dirname);
  expect(outputCode).toBe(expectedOutputCode);
});
