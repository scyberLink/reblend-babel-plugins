"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypesExported = void 0;

var FooBasic = function FooBasic() {
  return Reblend.construct("div", null);
};

var FooExtraReference = function FooExtraReference() {
  return Reblend.construct("div", null);
};

var FooExtraReferenceSpread = function FooExtraReferenceSpread() {
  return Reblend.construct("div", null);
};

var FooWrapped = function FooWrapped() {
  return Reblend.construct("div", null);
};

var propTypesReferenced = {
  foo: PropTypes.string
};

var FooReferenced = function FooReferenced() {
  return Reblend.construct("div", {
    bar: propTypesReferenced
  });
};

var propTypesExported = {
  foo: PropTypes.string
};
exports.propTypesExported = propTypesExported;

var FooExported = function FooExported() {
  return Reblend.construct("div", null);
};

var FooCreateClass = createReblendClass({
  displayName: "FooCreateClass"
});
