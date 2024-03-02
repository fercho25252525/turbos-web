export class User {
    userName!: string;
    password!: string;
    name!: string;
    lastName!: string;
    email!: string;
    documentNumber!: string;
    gender!: string;
    photo!: string;
    enabled!: boolean;
    birthDate!: String;
    roles: string[] = [];
}

export class UserAdd {
    userName!: string;
    name!: string;
    lastName!: string;
    email!: string;
    documentNumber!: string;
    gender!: string;
    photo!: string;
    birthDate!: String;
    role!: Role[];
}

export class Role {
    id!: number;
    name!: string;
}
