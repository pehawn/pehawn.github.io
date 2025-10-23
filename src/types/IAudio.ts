import { IAlbum } from "./IAlbum";
import { IStem } from "./IStem";

export interface IAudio {
	Path: string;
	Name: string;
	FullName?: string;
	Duration?: number;
	CurrentTimestampEventId?: number;
	Paused?: boolean;
	Reversed?: boolean;
	Looped?: boolean;
	LoopStart?: number;
	LoopEnd?: number;
	Bpm?: number;
	Stems?: IStem[];
	IsHover?: boolean;
	Order?: number;
	Album?: IAlbum;
	EventEndId?: number;
}
