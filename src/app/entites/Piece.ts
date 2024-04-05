import { Lieu } from "./Lieu";

export class Piece {
    uuid: string | null = null;
    nom: string = "";
    lieu: Lieu = new Lieu();
}