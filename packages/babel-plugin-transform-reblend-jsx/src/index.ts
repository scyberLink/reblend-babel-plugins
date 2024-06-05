/* eslint-disable @babel/development/plugin-name */

import createPlugin from './create-plugin';

export default createPlugin({
  name: 'transform-reblend-jsx',
  development: false,
});

export type { Options } from './create-plugin';
