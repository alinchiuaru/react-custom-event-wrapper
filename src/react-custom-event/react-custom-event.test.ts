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

  it("should dispatch a custom event", () => {
    const cbFn = jest.fn();
    document.addEventListener(testEvent.type, cbFn);

    dispatchCustomEvent(testEvent(1));

    expect(cbFn).toHaveBeenCalled();
  });

  describe("Register and remove custom event listener", () => {
    it("should callback with the correct detail data", () => {
      const cbFn = jest.fn((e: CustomEvent) => {
        return e.detail;
      });

      addEventListener(testEvent, cbFn);
      dispatchCustomEvent(testEvent(eventPayload));
      expect(cbFn).toHaveReturnedWith(eventPayload);
    });

    it("should remove a custom event listener", () => {
      const cbFn = jest.fn((e: CustomEvent) => {
        return e.detail;
      });

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

  it("should callback with the correct detail data", () => {
    const cbFn = jest.fn((e: CustomEvent) => {
      return e.detail;
    });

    renderHook(() => useCustomEventListener(testEvent, cbFn));
    dispatchCustomEvent(testEvent(eventPayload));
    expect(cbFn).toHaveReturnedWith(eventPayload);
  });

  it("should remove the event listener on cleanup", () => {
    const cbFn = jest.fn((e: CustomEvent) => {
      return e.detail;
    });

    renderHook(() => useCustomEventListener(testEvent, cbFn));
    dispatchCustomEvent(testEvent(eventPayload));

    cleanup();

    dispatchCustomEvent(testEvent(eventPayload));
    expect(cbFn).toHaveBeenCalledTimes(1);
  });
});
