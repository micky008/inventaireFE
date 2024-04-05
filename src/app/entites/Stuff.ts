import { Tag } from "./Tag";

export class Stuff {
    uuid: string | null = null;
    quantite: number = 0;
    desrc: string = "";
    note: string | null = null;
    tags: Tag[] | null = null;
}

