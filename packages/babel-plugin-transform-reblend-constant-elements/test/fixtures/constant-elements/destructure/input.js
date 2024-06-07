class AnchorLink extends Reblend {
  render() {
    const { isExternal, children } = this.props;
    if (isExternal) {
      return <a>{children}</a>;
    }

    return <Link>{children}</Link>;
  }
}
