// import React from "react";
import ReactDOM from "react-dom";
import Didact from "./mini-react";

let callId = -1;
const state = [];

// eslint-disable-next-line
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
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(100);

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

/** @jsx Didact.createElement */
const element = (
  <div style="background: salmon">
    <h1>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>
);

console.log(element);

const rootElement = document.getElementById("root");
// Didact.render(<MiniReact />, rootElement);

Didact.render(element, rootElement);
