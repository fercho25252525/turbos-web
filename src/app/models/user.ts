export class User {
    id!: number;
    username!: string;
    password!: string;
    name!: string;
    lastName!: string;
    email!: string;
    roles: string[] = [];
}
