import React from "react";
import { defer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";
import { createResource } from "./hooks/useCreateResource";

export class Suspense extends React.Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidMount() {
    this.setState({
      a: "1"
    });
  }

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

const source = createResource("https://api.github.com/users?per_page=5");

export const PromiseThrower = (props) => {
  const data = source.read();
  return (
    <div>
      {data.map((item) => (
        <img
          src={item.avatar_url}
          alt={item.id}
          key={item.id}
          width={100}
          height={100}
        />
      ))}
    </div>
  );
};
