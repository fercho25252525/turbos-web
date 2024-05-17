import { User } from "./user";

export class WorkDescription {
    idWork!: number;
    typeWork!: string;
    coste!: number;
    mec?: string
    mechanic?: User | null;
}

export class WorkDescriptionAdd {
    typeWork!: string;
    coste!: number;
    mechanic!: User;
}
