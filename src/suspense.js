import React from "react";

export class Suspense extends React.Component {
  state = {
    hasError: false
  };

  componentDidCatch(error) {
    if (error instanceof Promise) {
      this.setState({ hasError: true }, () => {
        error.then(() => {
          this.setState({ hasError: false });
        });
      });
    }
  }

  render() {
    const { fallback, children } = this.props;
    const { hasError } = this.state;

    return <>{hasError ? fallback : children}</>;
  }
}

let hasGet = false;
const fetch = () => {
  if (hasGet) {
    return "Fetch Successfully.";
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      hasGet = true;
      resolve("Data Ready.");
    }, 2000);
  });
};

export class PromiseThrower extends React.Component {
  getData() {
    const data = fetch(); // return a promise that will be catched by Suspense
    if (data instanceof Promise) {
      throw data;
    }

    return data;
  }
  render() {
    const data = this.getData();
    return data;
  }
}
