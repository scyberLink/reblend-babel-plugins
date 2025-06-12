import * as path from "path";
import * as fs from "fs";
import { transformSync } from "@babel/core"; // Assuming you're using Babel

interface TransformResult {
  outputCode: string;
  expectedOutputCode: string;
}

export function run(dir: string, writeOutFile = false): TransformResult {
  const inputFilePath = path.resolve(dir, "input.ts").replace("/lib/", "/src/");
  const babelOptionPath = path.resolve(dir, "option.json").replace("/lib/", "/src/");
  const outputFilePath = path
    .resolve(dir, "output.js")
    .replace("/lib/", "/src/");

  // Read the input code
  const inputCode = fs.readFileSync(inputFilePath, "utf8");
  let babelOptions = {}
  try {
    babelOptions = require(babelOptionPath);
  } catch (error) {
  }

  // Use Babel to transform the code (assuming it's needed)

  const config = {
    filename: inputFilePath,
    presets: [[require.resolve('../index.js'), babelOptions]],
  };
  let outputCode = ''
  try {
    outputCode = transformSync(inputCode, config)!.code as string;
  } catch (error) {
    console.error(error)
  }

  const write = () => fs.writeFileSync(outputFilePath, `${outputCode}`);
  let writing: boolean = false;
  let expectedOutputCode: string = "";
  try {
    // Read the expected output code, handle potential errors
    expectedOutputCode = fs.readFileSync(outputFilePath, "utf8");
  } catch (error) {
    if (writeOutFile) {
      write();
      writing = true;
      console.warn(
        `Expected output file "${outputFilePath}" not found, using transformed code.`
      );
    } else {
      throw error; // Re-throw the error if not writing the output file
    }
  }

  writeOutFile && !writing && write();

  return {
    outputCode: outputCode as any,
    expectedOutputCode: (writeOutFile ? outputCode : expectedOutputCode) as any,
  };
}

export function generateOutputFiles(filepath = ""): void {
  if (
    !filepath ||
    !fs.existsSync(filepath) ||
    !fs.statSync(filepath).isDirectory()
  ) {
    return;
  }
  if (fs.existsSync(path.resolve(filepath, "input.js"))) {
    run(filepath, true);
  }
  for (const dir of fs.readdirSync(filepath)) {
    const fullDir = path.resolve(filepath, dir);
    generateOutputFiles(fullDir);
  }
}
