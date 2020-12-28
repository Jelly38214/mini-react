/**
 * Build a react from scratch
 * Step I: The `createElement` Function
 * Step II: The `render` Function
 * Step III: Concurrent Mode
 * Step IV: Fibers
 * Step V: Render and Commit phases
 * Step VI: Reconciliation
 * Step VII: Function Component
 * Step VIII: Hooks
 */

/**
 * Step I
 * Create an object with type and props properties
 * React doesn’t wrap primitive values or create empty arrays when there aren’t children, but we do it because it will simplify our code, and for our library we prefer simple code than performant code.
 */
const TEXT_ELEMENT = "TEXT_ELEMENT";
function createElement(type, props, ...children) {
  console.log(type, props, children);
  return {
    type,
    props: {
      ...props,
      children: children.map((item) => {
        return typeof item === "object" ? item : createTextElement(item);
      })
    }
  };
}

function createTextElement(txt) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: txt,
      children: []
    }
  };
}

/**
 * Step II
 */
function render(element, container) {
  const dom =
    element.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(element.type);

  // assign the properties except children property
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));

  element.props.children.forEach((child) => render(child, dom)); // recursively do the same for the children
  container.appendChild(dom);
}

export default {
  createElement,
  createTextElement,
  render
};
