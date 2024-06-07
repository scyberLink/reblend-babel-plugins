"use strict";

var Foo1 = function Foo1() {
  return Reblend.construct("div", null);
};

Foo1.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

var Foo2 = function Foo2() {
  return Reblend.construct("div", null);
};

Foo2.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

var Foo3 = function Foo3() {
  switch (true) {
    case true:
      if (true) {
        return Reblend.construct("div", null);
      } else {
        return Reblend.construct("span", null);
      }

      break;
  }
};

Foo3.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

function Foo4() {
  return Reblend.construct("div", null);
}

Foo4.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

function Foo5() {
  var bar5 = function bar5() {
    return Reblend.construct("div", null);
  };

  return bar5();
}

Foo5.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

function Foo6() {
  var result = bar6();
  return result;

  function bar6() {
    return Reblend.construct("div", null);
  }
}

Foo6.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

function Foo7() {
  var shallow = {
    shallowMember: function shallowMember() {
      return Reblend.construct("div", null);
    }
  };
  return shallow.shallowMember();
}

Foo7.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

function Foo8() {
  var obj = {
    deep: {
      member: function member() {
        return Reblend.construct("div", null);
      }
    }
  };
  return obj.deep.member();
}

Foo8.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

var Foo9 = function Foo9() {
  return Reblend.construct("div", null);
};

Foo9.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

var Foo10 = function Foo10() {
  return Reblend.construct("div", null);
};

Foo10.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

var Foo11 = function Foo11() {
  return true && Reblend.construct("div", null);
};

Foo11.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

function Foo12(props) {
  return /* Reblend.cloneElement(props.children); */
}

Foo12.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};
var Foo13 = Reblend.memo(function () {
  return true && Reblend.construct("div", null);
});
Foo13.propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};
