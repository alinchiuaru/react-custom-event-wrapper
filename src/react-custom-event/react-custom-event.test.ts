import {
  createCustomEvent,
  dispatchCustomEvent,
  useCustomEventListener,
  addEventListener,
  removeEventListener,
} from "./index";

import { renderHook, cleanup } from "@testing-library/react-hooks";

describe("Adding, removing and dispatching of custom events", () => {
  const testEvent = createCustomEvent<number>("TEST_EVENT");
  const eventPayload = 444;
  let cbFn: (...args: any[]) => any;

  beforeEach(() => {
    cbFn = jest.fn((e: CustomEvent) => {
      return e.detail;
    });
  });

  it("should dispatch a custom event", () => {
    document.addEventListener(testEvent.type, cbFn);

    dispatchCustomEvent(testEvent(1));

    expect(cbFn).toHaveBeenCalled();
  });

  describe("Register and remove custom event listener", () => {
    it("should callback with the correct detail data", () => {
      addEventListener(testEvent, cbFn);
      dispatchCustomEvent(testEvent(eventPayload));
      expect(cbFn).toHaveReturnedWith(eventPayload);
    });

    it("should remove a custom event listener", () => {
      addEventListener(testEvent, cbFn);
      dispatchCustomEvent(testEvent(eventPayload));

      removeEventListener(testEvent, cbFn);
      dispatchCustomEvent(testEvent(eventPayload));
      expect(cbFn).toHaveBeenCalledTimes(1);
    });
  });
});

describe("useCustomEventListener hook tests", () => {
  const testEvent = createCustomEvent<number>("TEST_EVENT");
  const eventPayload = 444;
  let cbFn: (...args: any[]) => any;

  beforeEach(() => {
    cbFn = jest.fn((e: CustomEvent) => {
      return e.detail;
    });

    renderHook(() => useCustomEventListener(testEvent, cbFn));
  });

  afterEach(() => {
    cleanup();
  });

  it("should callback with the correct detail data", () => {
    dispatchCustomEvent(testEvent(eventPayload));
    expect(cbFn).toHaveReturnedWith(eventPayload);
  });

  it("should callback the correct amount of times", () => {
    const times = 3;

    for (let i = 0; i < times; i++) {
      dispatchCustomEvent(testEvent(eventPayload));
    }

    expect(cbFn).toHaveBeenCalledTimes(times);
  });

  it("should remove the event listener on cleanup", () => {
    dispatchCustomEvent(testEvent(eventPayload));

    cleanup();

    dispatchCustomEvent(testEvent(eventPayload));
    expect(cbFn).toHaveBeenCalledTimes(1);
  });
});
