import Reblend, { useContext } from "reblendjs";
import createRoute, { MatchedRoute } from "../contexts/routes";
export default class Route extends Reblend {
  static ELEMENT_NAME = "Route";
  constructor() {
    super();
  }
  async initState() {
    const thisRoute = this.props.element || Reblend.construct.bind(this)(this.props.Component, null);
    this.state.thisRoute = thisRoute;
    const {
      y,
      ...es
    } = useCallback.bind(this)();
    this.state.y = y;
    this.state.es = es;
    if (!this.state.thisRoute) {
      throw new Error("Route should have element or Component prop");
    }
    createRoute({
      [this.props.path]: this.state.thisRoute
    });
    const matchedRoute = useContext.bind(this)(MatchedRoute, "matchedRoute");
    this.state.matchedRoute = matchedRoute;
  }
  async initProps({
    Component,
    element,
    path,
    ...props
  }) {
    this.props = arguments[0] || {};
    this.props.Component = Component;
    this.props.element = element;
    this.props.path = path;
    this.props = {
      ...this.props,
      ...props
    };
  }
  async html() {
    return this.state.matchedRoute == this.state.thisRoute ? this.state.matchedRoute : null;
  }
}
/* @Reblend: Transformed from function to class */