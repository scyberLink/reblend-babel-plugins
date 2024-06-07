var { createClass } = require('./notReblend')
var PropTypes = require('prop-types')

var Class1 = createClass({
  displayName: 'Class1',
  propTypes: {
    foo: PropTypes.string,
  },
})
