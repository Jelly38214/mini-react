/**
 * Build a react from scratch
 * Step I: The `createElement` Function
 * Step II: The `render` Function
 * Step III: `Concurrent Mode`
 * Step IV: `Fibers`
 * Step V: `Render and Commit phases`
 * Step VI: Reconciliation
 * Step VII: Function Component
 * Step VIII: Hooks
 */

const TEXT_ELEMENT = "TEXT_ELEMENT";
/**
 * interface nextUnitOfWork {dom, props}
 */
let nextUnitOfWork = null;
let workInProgressRoot = null; // root of fiber tree
let currentRoot = null; // A referfence to that `last fiber tree` committed to the DOM

/**
 * Step I
 * Create an object with type and props properties
 * React doesn’t wrap primitive values or create empty arrays when there aren’t children, but we do it because it will simplify our code, and for our library we prefer simple code than performant code.
 */
function createElement(type, props, ...children) {
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
function createDOM(fiber) {
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // assign the properties except children property
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = fiber.props[name]));

  return dom;
}

function render(element, container) {
  // set unitOfWork to the root of the fiber tree
  workInProgressRoot = {
    dom: container,
    props: { children: [element] },
    alternate: currentRoot
  };

  nextUnitOfWork = workInProgressRoot;
}

/**
 * Step III
 */
function workLoop(deadline) {
  let shouldYield = false; //  whether hand in control
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  // Finish all work, then commit all updates to dom
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
}

/* Not only performs the work but also return the next unit of work
 * 1. add the element to the DOM
 * 2. create the fibers for the element's children
 * 3. select the next unit of work
 */
function performUnitOfWork(fiber) {
  // 1
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }

  /**
   * Mutate DOM each time, and will be interrupted by browser some cases
   */
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  // 2
  const elements = fiber.props.children;
  reconcileChild(fiber, elements); // create new fibers

  // 3
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}

window.requestIdleCallback(workLoop); // schedule

/**
 * Step IV
 * In order to organize the units of work, we'll need a data structure: fiber tree
 * One fiber for one element and each fiber will be a unit of work
 * `interface fiber {child, parent, sibling, type, props, dom, alternate}`
 * alternate property is a link to the old fiber committed to the DOM in previous commit phase
 */

/**
 * Step V
 * commit the whole fiber tree to the DOM when all work done
 j recursively appends node to the DOM
 */
function commitRoot() {
  // TODO: Add nodes to DOM
  commitWork(workInProgressRoot.child);
  /**
   * current update done, assign workInProgress fiber tree to be current fiber tree
   */
  currentRoot = workInProgressRoot;
  workInProgressRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  const domParent = fiber.parent.dom;
  domParent.append(fiber.dom);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function reconcileChild(workInProgressFiber, elements) {
  let index = 0;
  let oldFiber =
    workInProgressFiber.alternate && workInProgressFiber.alternate.child;

  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    // TODO compare oldFiber to element
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: workInProgressRoot,
      dom: null
    };

    if (index === 0) {
      workInProgressRoot.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

export default {
  createElement,
  createTextElement,
  render
};
