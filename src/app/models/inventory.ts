import { Provider } from "./provider";

export class Inventory {
    id!: number;
    name!: string;
    description!: string;
    cuantityStock!: number;
    unitPrice!: number;
    purchaseDate!: Date;
    status!: string;
    category!: string;
    provider!: Provider;
}
export class InventoryEdit {
    id!: number;
    name!: string;
    description!: string;
    cuantityStock!: number;
    unitPrice!: number;
    purchaseDate!: Date;
    status!: string;
    category!: string;
    provider!: Providers;
}

export class InventoryAdd {
    name!: string;
    description!: string;
    cuantityStock!: number;
    unitPrice!: number;
    purchaseDate!: Date;
    status!: string;
    category!: string;
    provider!: Providers;
}


export class Providers {
    id!: number;
}
