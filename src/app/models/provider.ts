
export class Provider { 
    id!: number | null;
    name!: string;
    address!: string;
    phone!: string;
    email!: string;
    additionalInfo!: string;
    dateCreation!: string;
}

export class ProviderAdd {
    name!: string;
    address!: string;
    phone!: string;
    email!: string;
    additionalInfo!: string;
}

export class ProviderEdit {
    id!: number;
    name!: string;
    address!: string;
    phone!: string;
    email!: string;
    additionalInfo!: string;
}
