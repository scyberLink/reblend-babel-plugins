var _reblend2 = require('reblend');
var PropTypes = require('prop-types');

// reblend >= 15.6
var Class1 = _reblend2.default.createClass({
  displayName: 'Class1',
  propTypes: {
    foo: PropTypes.string,
  },
});

// reblend < 15.6
var Class2 = _reblend2.default.createClass({
  displayName: 'Class2',
  propTypes: {
      foo: _reblend2.default.PropTypes.string,
  },
});
