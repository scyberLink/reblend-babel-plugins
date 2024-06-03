import * as Reblend from 'reblend';
import ReblendDOM from 'reblend-dom';

const Portal = ReblendDOM.createPortal(
  Reblend.construct('div'),
  document.getElementById('test')
);
