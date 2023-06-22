import { Channel } from "tone";

export interface IStem {
	Path: string;
	Name: string;
	Channel?: Channel;
	Volume: number;
}
