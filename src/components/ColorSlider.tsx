import * as React from "react";
import { HuePicker } from "./colorPicker/HuePicker";
import { AppContext } from "../context/AppContext";
import { ISwatch } from "../types/ISwatch";
import useDevHook, { ReactHook } from "../hooks/UseDevHook";

const ColorSlider: React.FunctionComponent<any> = ({}): JSX.Element => {
	const env: string = process.env.GATSBY_ENV;

	const appContext = React.useContext(AppContext);

	const [hueValues, setHueValues] = useDevHook<number[]>([], "hueValues", ReactHook.State, env);
	const [selectedHueValue, setSelectedHueValue] = useDevHook<number>(0, "selectedHueValue", ReactHook.State, env);
	const [selectedHexValue, setSelectedHexValue] = useDevHook<string>("", "selectedHexValue", ReactHook.State, env);

	React.useEffect(() => {
		let hueValues: number[] = [];

		hueValues = appContext.Swatches.map((swatch) => {
			return swatch.HueValue;
		});

		setHueValues(hueValues);
	}, [appContext.Swatches]);

	React.useEffect(() => {
		if (appContext.SelectedSwatch) {
			setSelectedHueValue(appContext.SelectedSwatch.HueValue);
			setSelectedHexValue(appContext.SelectedSwatch.HexValue);
		}
	}, [appContext.SelectedSwatch]);

	const updateSwatch = (selectedHslValue: number): void => {
		if (hueValues.includes(selectedHslValue) && selectedHslValue !== appContext.SelectedSwatch.HueValue) {
			let newSelection: ISwatch = appContext.Swatches.find((swatch) => swatch.HueValue === selectedHslValue);
			for (const i in newSelection.Tracks) {
				newSelection.Tracks[i].IsHover = false;
			}
			appContext.SetSelectedSwatch(newSelection);
			appContext.SetUpdateSwatch(false);
		}
	};

	return (
		<React.Fragment>
			<div style={{ padding: "30px" }}>
				<HuePicker hueValues={hueValues} hue={selectedHueValue} onUpdate={updateSwatch} />
			</div>
		</React.Fragment>
	);
};

export default ColorSlider;
