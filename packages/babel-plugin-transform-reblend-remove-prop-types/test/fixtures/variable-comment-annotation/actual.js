import Reblend from 'reblend'
import PropTypes from 'prop-types'
import { connect } from 'reblend-redux'
import FooComponent from './FooComponent'

const Foo = connect(() => {}, () => {})(FooComponent);

Foo.propTypes /* remove-proptypes */ = {
  bar: PropTypes.string.isRequired,
}

export default Foo
