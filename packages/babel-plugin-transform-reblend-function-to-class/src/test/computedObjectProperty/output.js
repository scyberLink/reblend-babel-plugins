import Reblend, { useContext } from "reblendjs";
import createRoute, { MatchedRoute } from "../contexts/routes";
export default class Route extends Reblend {
  static ELEMENT_NAME = "Route";
  constructor() {
    super();
  }
  init() {
    const thisRoute = this.props.element || /*#__PURE__*/Reblend.construct.bind(this)(this.props.Component, null);
    this.thisRoute = thisRoute;
    if (!this.thisRoute) {
      throw new Error("Route should have element or Component prop");
    }
    createRoute({
      [this.props.path]: this.thisRoute
    });
    const matchedRoute = useContext.bind(this)(MatchedRoute, "matchedRoute");
    this.matchedRoute = matchedRoute;
  }
  html() {
    return this.matchedRoute == this.thisRoute ? this.matchedRoute : null;
  }
}
/* Transformed from function to class */