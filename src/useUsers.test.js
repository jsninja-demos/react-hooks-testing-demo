import React from "react";
import ReactTestRenderer from "react-test-renderer";
import { useUsers } from "./App";
import { flushEffects } from "./helpers";

jest.mock("./api");

it("check it is loading", async () => {
  const C = ({ hook }) => {
    const { isLoading } = useUsers();
    hook(isLoading);
    return null;
  };

  const hookResultFn = jest.fn();
  ReactTestRenderer.create(<C hook={hookResultFn} />);
  expect(hookResultFn.mock.calls.length).toBe(1);
  expect(hookResultFn.mock.calls[0][0]).toBeFalsy();
  flushEffects();
  expect(hookResultFn.mock.calls.length).toBe(2);
  expect(hookResultFn.mock.calls[1][0]).toBeTruthy();
});

it("check it renders users", async () => {
  const C = ({ hook }) => {
    const { users } = useUsers();
    hook(users);
    return null;
  };

  const hookResultFn = jest.fn();
  ReactTestRenderer.create(<C hook={hookResultFn} />);
  flushEffects();
  await new Promise(ok => setTimeout(ok));
  const lastCall =
    hookResultFn.mock.calls[hookResultFn.mock.calls.length - 1][0];
  expect(lastCall.length).toBe(2);
});
