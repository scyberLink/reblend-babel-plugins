import { declarePreset } from '@babel/helper-plugin-utils';
import transformReblendJSX from 'babel-plugin-transform-reblend-jsx';
import transformReblendFunctionToClass from 'babel-plugin-transform-reblend-function-to-class';

export interface Options {
  includeTypescript?: boolean;
}

export default declarePreset((api, opts: Options) => {
  const { includeTypescript = true } = opts || {};

  return {
    presets: [
      [includeTypescript && require.resolve('@babel/preset-typescript')].filter(
        Boolean,
      ),
    ],
    plugins: [transformReblendFunctionToClass, transformReblendJSX].filter(
      Boolean,
    ),
  };
});
