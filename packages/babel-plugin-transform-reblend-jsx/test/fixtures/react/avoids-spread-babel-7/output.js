/*#__PURE__*/ Reblend.construct(
  E,
  babelHelpers.extends({}, props, {
    last: true,
  })
);
/*#__PURE__*/ Reblend.construct(
  E,
  babelHelpers.extends(
    {
      first: true,
    },
    props
  )
);
/*#__PURE__*/ Reblend.construct(E, babelHelpers.extends({}, pre, suf));
/*#__PURE__*/ Reblend.construct(
  E,
  babelHelpers.extends(
    {
      first: true,
    },
    pre,
    {
      mid: true,
    },
    suf
  )
);
/*#__PURE__*/ Reblend.construct(
  E,
  babelHelpers.extends(
    {},
    pre,
    {
      mid: true,
    },
    suf,
    {
      last: true,
    }
  )
);
/*#__PURE__*/ Reblend.construct(
  E,
  babelHelpers.extends(
    {},
    pre,
    {
      mid1: true,
      mid2: true,
    },
    suf
  )
);
