import React from "react";
import ReactTestRenderer from "react-test-renderer";
import { useWindowWidth } from "./App";
import { flushEffects } from "./helpers";
import AppContext from "./appContext";

it("check it reports correct Width", async () => {
  const C = ({ hook }) => {
    const windowWidth = useWindowWidth();
    hook(windowWidth);
    return null;
  };

  const hookResultFn = jest.fn();
  const windowMock = {
    addEventListener: jest.fn(),
    innerWidth: 700,
  };
  ReactTestRenderer.create(
    <AppContext.Provider value={{ window: windowMock }}>
      <C hook={hookResultFn} />
    </AppContext.Provider>,
  );
  expect(hookResultFn.mock.calls.length).toBe(1);
  expect(hookResultFn.mock.calls[0][0]).toBe(700);
});

it("check it updates width on event", async () => {
  const C = ({ hook }) => {
    const windowWidth = useWindowWidth();
    hook(windowWidth);
    return null;
  };

  const hookResultFn = jest.fn();
  const windowMock = document.createDocumentFragment();
  windowMock.innerWidth = 700;
  ReactTestRenderer.create(
    <AppContext.Provider value={{ window: windowMock }}>
      <C hook={hookResultFn} />
    </AppContext.Provider>,
  );
  flushEffects();
  const event = document.createEvent("Event");
  event.initEvent("resize", true, true);
  windowMock.innerWidth = 800;
  windowMock.dispatchEvent(event);
  const lastCall =
    hookResultFn.mock.calls[hookResultFn.mock.calls.length - 1][0];
  expect(lastCall).toBe(800);
});
