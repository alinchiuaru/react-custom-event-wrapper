import React, { useEffect, useState } from "react";
import "./App.css";
import {
  createCustomEvent,
  useCustomEventListener,
  dispatchCustomEvent,
} from "./react-custom-event";

const testEvent = createCustomEvent<{ count: number }>("TEST_EVENT");

function App() {
  const [state, setState] = useState(0);

  const sendEvent = () => {
    dispatchCustomEvent(testEvent({ count: state }));
  };

  return (
    <div className="App">
      <Child />
      <button
        onClick={() => setState((prev) => prev + 1)}
      >{`Count: ${state}`}</button>

      <button onClick={sendEvent}>Send event</button>
    </div>
  );
}

function Child() {
  useEffect(() => {
    console.log("Child component (re)rendered");
  });

  useCustomEventListener(testEvent, ({ detail }) => {
    console.log("Child component listener --- event detail:", detail);
  });

  return <div>Child component</div>;
}

(window as any).sendEvent = (count: number) => {
  dispatchCustomEvent(testEvent({ count }));
};

export default App;
