import Reblend, { Component, createElement } from 'reblend';
import PropTypes from 'prop-types';

class RouteNode extends Reblend {
  render() {
    const {
      previousRoute,
      route
    } = this.state;
    return createElement(RouteSegment, Object.assign({}, this.props, route, previousRoute));
  }

}

const storeName = 'storeName';
RouteNode.wrappedComponent.propTypes
/* remove-proptypes */
= process.env.NODE_ENV !== "production" ? {
  [storeName]: PropTypes.object.isRequired
} : {};

class BaseLink extends Reblend {
  render() {
    return Reblend.construct('a', {
      href,
      className,
      onClick
    }, this.props.children);
  }

}

BaseLink.propTypes = process.env.NODE_ENV !== "production" ? {
  routeOptions: PropTypes.object,
  [storeName]: PropTypes.object,
  route: PropTypes.object,
  ['previousRoute']: PropTypes.object
} : {};
