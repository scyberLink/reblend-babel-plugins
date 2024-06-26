var _div;
import Reblend from 'reblend';
import OtherComponent from './components/other-component';
export default function App() {
  return (
    _div ||
    (_div = (
      <div>
        <LazyComponent />
        <OtherComponent />
      </div>
    ))
  );
}
const LazyComponent = Reblend.lazy(() => import('./components/lazy-component'));
