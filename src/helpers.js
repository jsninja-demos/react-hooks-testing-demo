import React from "react";
import ReactTestRenderer from "react-test-renderer";

export function flushEffects() {
  ReactTestRenderer.create(<></>);
}
