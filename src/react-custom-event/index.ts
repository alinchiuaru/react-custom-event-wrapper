import { useEffect } from "react";

interface eventCreator<D, T> {
  (data: D): { event: CustomEvent<D>; type: T };
  type: T;
}
interface anyEventCreator extends eventCreator<any, string> {}
interface eventListener<T extends anyEventCreator> {
  (event: ReturnType<T>["event"]): void;
}

function addEventListener<EC extends anyEventCreator>(
  eventCreator: EC,
  listener: eventListener<EC>
) {
  document.addEventListener(eventCreator.type, listener as EventListener);
}

function removeEventListener<EC extends anyEventCreator>(
  eventCreator: EC,
  listener: eventListener<EC>
) {
  document.removeEventListener(eventCreator.type, listener as EventListener);
}

export function createCustomEvent<D = void, T extends string = string>(
  type: T
): eventCreator<D, T> {
  const fn = function (data: D) {
    return {
      event: new CustomEvent(type, { detail: data }),
      type,
    };
  };

  fn.type = type;

  return fn;
}

export function dispatchCustomEvent<C extends ReturnType<anyEventCreator>>(
  creator: C
): void {
  document.dispatchEvent(creator.event);
}

export function useCustomEventListener<EC extends anyEventCreator>(
  eventCreator: EC,
  listener: eventListener<EC>
) {
  useEffect(() => {
    addEventListener(eventCreator, listener);

    return function cleanup() {
      removeEventListener(eventCreator, listener);
    };
  });
}
