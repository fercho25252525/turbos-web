import { User } from "../models/user";

export class Pqrs {
    idPqrs!: Number;
    typePqrs!: string;
    datePqrs!: string;
    status!: string;
    priority!: string;
    description!: string;
    response!: string;
    view!: Number;
	user!: User;
}

export class PqrsAdd {
    typePqrs!: string;
    priority!: string;
    description!: string;
	user!: UserPqrs;
}

export class UserPqrs {
    userName!: string;
}
