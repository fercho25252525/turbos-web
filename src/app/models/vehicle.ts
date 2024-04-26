import { Customer, CustomerAdd, User } from "./user";

export class Vehicle {
    plate!: string;
	brand!: string;
	city!: string;
	model!: string;
	typeVehicle!: string;
	typeFuels!: string;
	status!: string;
	color!: string;
	nextMaintenanceDate!: Date;
    registerDate!: Date;
    customer!: CustomerAdd;
}

export class VehicleAdd {
    plate!: string;
	brand!: string;
	city!: string;
	model!: string;
	typeVehicle!: string;
	typeFuels!: string;
	status!: string;
	color!: string;
	nextMaintenanceDate!: string | Date;
	customer!: CustomerAdd;
}

export interface Product {
    id?: string;
    details?: string;
    typeWork?: string;
	coste?: number
    
}
