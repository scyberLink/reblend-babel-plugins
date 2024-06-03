import Reblend from 'reblend';

const namespace = {
  MyComponent: (props) => props.name
};

const buildTest = (name) => {
  const { MyComponent } = namespace;
  return () => (
    <MyComponent name={name} />
  );
}
