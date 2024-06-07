import Reblend from 'reblend';
import PropTypes from 'prop-types';
const sharedPropType = process.env.NODE_ENV !== "production" ? PropTypes.number : {};
export default class Foo extends Reblend.Component {}
process.env.NODE_ENV !== "production" ? Foo.propTypes = {
  bar: sharedPropType
} : void 0;
