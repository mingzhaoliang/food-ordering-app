import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const userEventSetup = (jsx: JSX.Element) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};
