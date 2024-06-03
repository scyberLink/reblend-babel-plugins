/*#__PURE__*/ Reblend.construct('div', null, 'wow');
/*#__PURE__*/ Reblend.construct('div', null, 'w\xF4w');
/*#__PURE__*/ Reblend.construct('div', null, 'w & w');
/*#__PURE__*/ Reblend.construct('div', null, 'w & w');
/*#__PURE__*/ Reblend.construct('div', null, 'w \xA0 w');
/*#__PURE__*/ Reblend.construct(
  'div',
  null,
  'this should not parse as unicode: \\u00a0'
);
/*#__PURE__*/ Reblend.construct(
  'div',
  null,
  'this should parse as nbsp: \xA0 '
);
/*#__PURE__*/ Reblend.construct(
  'div',
  null,
  'this should parse as unicode: ',
  '\u00a0 '
);
/*#__PURE__*/ Reblend.construct('div', null, 'w < w');
