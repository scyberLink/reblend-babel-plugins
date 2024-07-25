# Babel Plugin For Reblendjs: Transform Functions to ES6 Classes

This Babel plugin transforms JavaScript functions containing JSX into ES6 classes, facilitating the migration from function-based components to class-based components. It handles various nuances such as function bindings and state management hooks.

## Features

- Transforms functions containing JSX into ES6 classes.
- Binds functions and state hooks to the class instance.
- Converts `useState` hooks into class properties with automatic state setters.
- Adds a static `ELEMENT_NAME` property to each class, which holds the original function name.
- Handles arrow functions and variable declarators.

## Installation

To install the plugin, run:

```bash
npm install --save-dev babel-plugin-transform-functions-to-classes
```

## Usage

Add the plugin to your Babel configuration:

```json
{
  "plugins": ["transform-functions-to-classes"]
}
```

## Example

### Input

```jsx
import { useState } from 'reblendjs';

const MyComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
};
```

### Output

```jsx
import { useState } from 'reblendjs';

class MyComponent extends Reblend {
  static ELEMENT_NAME = 'MyComponent';

  constructor() {
    super();
  }

  init() {
    let [count, setCount] = useState.bind(this)(0);
    this.count = count;
    this.setCount = this.setCount.bind(this);
    this.apply(this.setCount, 'count');
    const handleClick = () => {
      setCount(count + 1);
    };
    this.handleClick = handleClick;
    this.handleClick = this.handleClick.bind(this);
  }

  html() {
    return <button onClick={this.handleClick}>Count: {this.count}</button>;
  }
}
```
