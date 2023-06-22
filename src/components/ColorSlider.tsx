import * as React from "react";
import { HuePicker } from "./colorPicker/HuePicker";
import { AppContext } from "../context/AppContext";
import { ISwatch } from "../types/ISwatch";

const ColorSlider: React.FunctionComponent<any> = ({}): JSX.Element => {
	const appContext = React.useContext(AppContext);

	const [hueValues, setHueValues] = React.useState<number[]>([]);
	const [selectedHueValue, setSelectedHueValue] = React.useState<number>(0);
	const [selectedHexValue, setSelectedHexValue] = React.useState<string>("");

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
