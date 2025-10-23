import * as Tone from "tone";

export interface IStem {
	Path: string;
	Name: string;
	Channel?: Tone.Channel;
	Volume: number;
}
