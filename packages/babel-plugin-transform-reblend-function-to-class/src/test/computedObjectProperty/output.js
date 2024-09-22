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
    const matchedRoute = useContext.bind(this)(MatchedRoute, "matchedRoute");
    this.matchedRoute = matchedRoute;
  }
  initProps({
    Component,
    element,
    path
  }, [yes]) {
    this.props = {};
    this.props.Component = Component;
    this.props.element = element;
    this.props.path = path;
    this.yes = yes;
  }
  html() {
    return this.matchedRoute == this.thisRoute ? this.matchedRoute : null;
  }
}
/* Transformed from function to class */