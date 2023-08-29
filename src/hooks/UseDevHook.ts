import React from "react";

export enum ReactHook {
	State = "state",
	Ref = "ref",
	Effect = "effect"
}

// Used to identify state object names in React DevTools Components tab
const useDevHook = <T>(initialValue: T, name: string, hookType: string, env: string): any => {
	switch (hookType) {
		case ReactHook.State:
			const [value, setValue] = React.useState<T>(initialValue);
			if (env === "DEV") {
				React.useDebugValue(`${name}: ${value}`);
			}
			return [value, setValue];
		case ReactHook.Ref:
			const ref = React.useRef(initialValue);
			if (env === "DEV") {
				React.useDebugValue(`${name}: ${ref}`);
			}
			return ref;
	}
};

export default useDevHook;
