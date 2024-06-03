var x = /*#__PURE__*/ Reblend.construct(
  'div',
  {
    /* a multi-line
     comment */
    attr1: 'foo',
  },
  /*#__PURE__*/ Reblend.construct('span', {
    // a double-slash comment
    attr2: 'bar',
  })
);
