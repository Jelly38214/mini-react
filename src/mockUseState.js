/**
 * 区分mount/update
 */
let isMount = true;
let workInProgressHook = null; // 指向链表上当前的hook

// 每个组件都有自己对应的fiber
// 函数组件内的hooks的相关数据，也是保存在组件对应的fiber中
const fiber = {
  stateNode: App,
  memoizedState: null //对于函数，该属性保存的是hook的数据(单向链表)，对于class，保存的是this.state
};

function useState(initialState) {
  let hook; // 当前useState对应的hook
  // 区分的意义：
  if (isMount) {
    hook = {
      memoizedState: initialState, // 这个memoizedState仅仅表示这个hook的状态
      next: null,
      // 队列(可以多次调用dispatchAction)，该hook做的状态改变，调用dispatchAction得到的传进来的值
      queue: {
        pending: null // 环状链表: 原因是不仅仅是计算新的state，还有考虑优先级，低的要被跳过去，环状方便操作
      }
    };
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      // 一个组件内有多个hook的情况
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  // 根据当前hook以及dispatchAction得到的值来共同计算新的状态
  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // 本次更新有新的update需要被执行
    // 剪开环状链表来计算新的状态， 因为queue.pending始终表示最后的更新项，故其next则是第一项
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = typeof action === "function" ? action(baseState) : action; // 可能action不一定是函数
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== queue.pending.next);

    hook.queue.pending = null; // 清空
  }

  hook.memoizedState = baseState; // 保存新的状态
  return [baseState, dispatchAction.bind(null, hook.queue)];
}

// dispatchAction怎么和hook对应起来呢？
function dispatchAction(queue, action) {
  // 表示一次更新
  const update = {
    action,
    next: null
  };

  if (queue.pending === null) {
    // 表示该hook还没有触发的更新
    // u0 -> u0 -> u0
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }

  // queue.pending保存的是最后一个update
  queue.pending = update;
  schedule(); // 触发更新
}

function schedule() {
  workInProgressHook = fiber.memoizedState; // 每次render时，先复位
  const app = fiber.stateNode(); // 触发组件render
  isMount = false;
  return app;
}

function App() {
  // updateNum，其实是一个dispatchAction
  const [num, updateNum] = useState(0);

  return {
    onClick() {
      updateNum((num) => num + 1);
    }
  };
}

window.app = schedule();
