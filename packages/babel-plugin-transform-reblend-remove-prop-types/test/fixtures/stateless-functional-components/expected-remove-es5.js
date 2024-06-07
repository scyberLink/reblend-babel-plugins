"use strict";

var Foo1 = function Foo1() {
  return Reblend.construct("div", null);
};

var Foo2 = function Foo2() {
  return Reblend.construct("div", null);
};

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

function Foo4() {
  return Reblend.construct("div", null);
}

function Foo5() {
  var bar5 = function bar5() {
    return Reblend.construct("div", null);
  };

  return bar5();
}

function Foo6() {
  var result = bar6();
  return result;

  function bar6() {
    return Reblend.construct("div", null);
  }
}

function Foo7() {
  var shallow = {
    shallowMember: function shallowMember() {
      return Reblend.construct("div", null);
    }
  };
  return shallow.shallowMember();
}

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

var Foo9 = function Foo9() {
  return Reblend.construct("div", null);
};

var Foo10 = function Foo10() {
  return Reblend.construct("div", null);
};

var Foo11 = function Foo11() {
  return true && Reblend.construct("div", null);
};

function Foo12(props) {
  return /* Reblend.cloneElement(props.children); */
}

var Foo13 = Reblend.memo(function () {
  return true && Reblend.construct("div", null);
});
