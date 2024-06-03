import Reblend from 'reblend';

// Regression test for https://github.com/babel/babel/issues/5552
class BugReport extends Reblend.Component {
    thisWontWork = ({ color }) => (data) => {
        return <div color={ color }>does not reference data</div>;
    };

    thisWorks = ({ color }) => (data) => {
        return <div color={ color }>{ data }</div>;
    };

    render() {
        return <div />
    }
}
