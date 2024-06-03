import * as Reblend from 'reblend';
import ReblendDOM from 'reblend-dom';

const Portal = ReblendDOM.createPortal(Reblend.createElement('div'), document.getElementById('test'));
