import Reblend from 'reblend';

class Greeting extends Reblend {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }

}
