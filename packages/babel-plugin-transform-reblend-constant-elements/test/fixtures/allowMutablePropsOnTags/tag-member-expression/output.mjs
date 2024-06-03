var _Intl$FormattedMessag;
import Intl from 'reblend-intl';
var Foo = Reblend.createClass({
  render: function () {
    return (
      _Intl$FormattedMessag ||
      (_Intl$FormattedMessag = (
        <Intl.FormattedMessage
          id="someMessage.foo"
          defaultMessage={'Some text, ' + 'and some more too. {someValue}'}
          description="A test message for babel."
          values={{
            someValue: 'A value.',
          }}
        />
      ))
    );
  },
});
