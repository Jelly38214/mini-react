import React, { Suspense, useState } from "react";
import ReactDOM from "react-dom";
import { PromiseThrower } from "./suspense";

class App extends React.Component {
  state = {
    count: 1
  };

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <>
        <Suspense fallback={<h1>Loading....</h1>}>
          <PromiseThrower />
        </Suspense>
        {this.state.count}
        <button onClick={this.handleClick}>Button</button>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
