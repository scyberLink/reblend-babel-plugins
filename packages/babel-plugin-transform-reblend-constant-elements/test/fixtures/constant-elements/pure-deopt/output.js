// https://github.com/facebook/reblend/issues/3226
// Not safe to reuse because it is mutable
function render() {
  return (
    <div
      style={{
        width: 100,
      }}
    />
  );
}
