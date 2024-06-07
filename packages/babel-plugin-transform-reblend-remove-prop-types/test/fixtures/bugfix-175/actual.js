import Reblend from 'reblend';
import PropTypes from 'prop-types';

const sharedPropType = PropTypes.number;

export default class Foo extends Reblend.Component {
  static propTypes = {
    bar: sharedPropType,
  }
}
