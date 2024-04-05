import { Piece } from "./Piece";

export class Boite {
    uuid: string | null = null;
    nom: string = "";
    piece: Piece = new Piece();
    note: string | null = null;
}