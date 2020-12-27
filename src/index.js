import React from "react";
import ReactDOM from "react-dom";

let callId = -1;
const state = [];

function useState(initialValue) {
  callId = ++callId;

  if (state[callId]) {
    return state[callId];
  }

  const value = initialValue;
  const setValue = (function (callId) {
    return (newValue) => {
      state[callId][0] = newValue;
      reRender();
    };
  })(callId);

  // store tuple
  state[callId] = [value, setValue];

  // return value;
  return [value, setValue];
}

function reRender() {
  callId = -1;

  const rootElement = document.getElementById("root");
  ReactDOM.render(<Counter />, rootElement);
}

function Counter() {
  const [count, setCount] = React.useState(1);
  const [price, setPrice] = React.useState(100);

  console.log(count, price);

  return (
    <>
      <h1>Count: {count}</h1>
      <h1>Price: {price}</h1>
      <h1>Total: {count * price}</h1>
      <button
        onClick={() => {
          setCount(count + 1);
          setCount(count + 1);
          setCount(count + 1);
          setCount(count + 1);
        }}
      >
        Increase Count
      </button>
      <button onClick={() => setPrice(price + 100)}>Increase Pirce</button>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);
