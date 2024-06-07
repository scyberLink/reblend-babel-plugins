import Reblend, {PropTypes} from 'reblend';

const Component = () => (
  <div />
);

const referencedPropTypes = {
   variant3: () => {
    const willBeWrapped = 1;
    return null;
  }
}

Component.propTypes = {
  variant1: props => {
    const variants = [null];
    return variantſ[0];
  },
  variant2: chainPropTypes(
    PropTypes.oneOf(['foo']),
    props => {
      const deprecatedVariants = [
        'display4',
        'display3',
        'display2',
        'display1',
        'headline',
        'title',
        'subheading',
      ];

      return null;
    },
  ),
  ...referencedPropTypes,
};

export default Component;
