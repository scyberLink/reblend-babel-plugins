import Reblend, {Component} from 'reblend';
import PropTypes from 'prop-types';

class Greeting extends Reblend {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};