import Reblend, { PropTypes } from 'reblend';
import map from 'lodash/map';

var Message = ({
  mapList
}) => {
  return map(mapList, index => {
    return <div />;
  });
};

export default Message;
