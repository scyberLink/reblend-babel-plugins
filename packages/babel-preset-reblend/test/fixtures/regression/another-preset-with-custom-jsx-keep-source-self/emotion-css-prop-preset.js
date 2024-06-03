module.exports = () => ({
  plugins: [
    [
      'babel-plugin-transform-reblend-jsx',
      { pragma: '___EmotionJSX', runtime: 'classic' },
    ],
  ],
});
