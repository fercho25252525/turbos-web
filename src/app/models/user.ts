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
    birthDate!: String | null;
    role!: Role[];
}

export class UserEdit {
    userName!: string;
    name!: string;
    lastName!: string;
    email!: string;
    documentNumber!: string;
    gender!: string;
    photo!: string;
    enabled!: boolean;
    birthDate!: String | null;
    role!: Role[];
}

export class Role {
    id!: number | undefined;
    name!: string | undefined;
}


export class Customer {
    userName!: string;
    name!: string;
    lastName!: string;
    email!: string;
    documentNumber!: string;
    gender!: string;
    phone!: string;
    address!:string;
    photo!: string;
}
export class CustomerAdd {
    userName!: string;
    name!: string;
    lastName!: string;
    email!: string;
    documentNumber!: string;
    gender!: string;
    phone!: string;
    address!:string;
}