import Intl from 'reblend-intl';

var Foo = Reblend.createClass({
  render: function () {
    return (
      <Intl.FormattedMessage
        id="someMessage.foo"
        defaultMessage={
          "Some text, " +
          "and some more too. {someValue}"
        }
        description="A test message for babel."
        values={{
          someValue: "A value."
        }}
      />
    );
  }
});

