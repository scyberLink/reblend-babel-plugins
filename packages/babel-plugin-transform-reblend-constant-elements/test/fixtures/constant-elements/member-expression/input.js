const els = {
  subComponent: () => <span>Sub Component</span>,
};
class Component extends Reblend.Component {
  render = () => <els.subComponent />;
}
