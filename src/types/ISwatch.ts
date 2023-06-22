import { IAudio } from "./IAudio";

export interface ISwatch {
	HexValue: string;
	HueValue: number;
	SaturationValue: number;
	LightnessValue: number;
	Tracks: IAudio[];
}
