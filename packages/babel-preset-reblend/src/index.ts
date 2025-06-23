import { declare } from '@babel/helper-plugin-utils';
import transformReblendJSX from 'babel-plugin-transform-reblend-jsx';
import transformReblendFunctionToClass from 'babel-plugin-transform-reblend-function-to-class';

export interface Options {
  includeTypescript?: boolean;
  cjs?: boolean;
}

export default declare((api, opts, dirname) => {
  const { includeTypescript = true, cjs = false } = opts || {};

  return {
    presets: [
      ...(includeTypescript
        ? [
            [
              require.resolve('@babel/preset-typescript'),
              {
                jsx: 'preserve',
                jsxPragma: 'Reblend.construct',
                jsxPragmaFrag: 'Reblend',
              },
            ],
          ]
        : []),
    ],
    plugins: [
      ...(cjs
        ? [
            [
              require.resolve('@babel/plugin-transform-modules-commonjs'),
              {
                loose: true,
                importInterop: 'none',
                enumerableModuleMeta: true,
                allowTopLevelThis: true,
              },
            ],
          ]
        : []),
      transformReblendFunctionToClass,
      transformReblendJSX,
    ].filter(Boolean),
  } as any;
});
