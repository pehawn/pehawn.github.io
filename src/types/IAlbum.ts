import { IAudio } from "./IAudio";

export interface IAlbum {
	Name: string;
	ReleaseDate: Date;
	Songs: IAudio[];
	Type: string;
	Artwork?: any;
}