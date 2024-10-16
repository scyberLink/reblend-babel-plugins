import Reblend, { useContext } from "reblendjs";
import createRoute, { MatchedRoute } from "../contexts/routes";
export default class Route extends Reblend {
  static ELEMENT_NAME = "Route";
  constructor() {
    super();
  }
  initState() {
    const thisRoute = this.props.element || Reblend.construct.bind(this)(this.props.Component, null);
    this.thisRoute = thisRoute;
    const {
      y,
      ...es
    } = useCallback.bind(this)("");
    this.y = y;
    this.es = es;
    if (!this.thisRoute) {
      throw new Error("Route should have element or Component prop");
    }
    createRoute({
      [this.props.path]: this.thisRoute
    });
    const matchedRoute = useContext.bind(this)(MatchedRoute, "matchedRoute");
    this.matchedRoute = matchedRoute;
  }
  initProps({
    Component,
    element,
    path,
    ...props
  }) {
    this.props = {};
    this.props.Component = Component;
    this.props.element = element;
    this.props.path = path;
    this.props = {
      ...this.props,
      ...props
    };
  }
  html() {
    return this.matchedRoute == this.thisRoute ? this.matchedRoute : null;
  }
}
/* Transformed from function to class */