import { Lieu } from "./Lieu";

export class Boite {
    uuid: string | null = null;
    nom: string = "";
    lieu: Lieu = new Lieu();
    note: string | null = null;
}