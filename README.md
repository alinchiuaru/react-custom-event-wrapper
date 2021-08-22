# react-custom-event-wrapper

A wrapper around the [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) API that exposes a React hook to listen to an event and has Typescript support.

---

## API

- createCustomEvent(type)
- useCustomEventListener(eventCreator, listenerCb)
- dispatchCustomEvent(eventCreator(...args))

---

## Example

```typescript
const testEvent = createCustomEvent<{ count: number }>("TEST_EVENT");

dispatchCustomEvent(testEvent({ count: 3 }));

// Within a React function component
// Also you will have TS support in the editor for the event
useCustomEventListener(testEvent, (event) => {
  console.log(event.detail.count);
});
```
