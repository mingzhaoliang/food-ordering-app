"use client";

import { useCallback, useState } from "react";

export default function withActionStateReset<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function WithActionStateReset(props: Omit<T, "onReset">) {
    const [formKey, setFormKey] = useState(true);

    const updateFormKey = useCallback(() => {
      setFormKey((prevState) => !prevState);
    }, []);

    return <WrappedComponent key={String(formKey)} {...(props as T)} onReset={updateFormKey} />;
  };
}
