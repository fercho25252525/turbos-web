import { User } from "./user";
import { Vehicle, VehicleAdd } from "./vehicle";
import { WorkDescription } from "./work-description";

export class WorkOrder {
    idOrder!: number;
    statusOrder!: string;
    estimatedCost!: number;
    realCost!: number;
    startDate!: Date;
    endDate!: Date;
    creationDate!: Date;
    comments!: string;
    workDescription!: WorkDescription[];
    vehicle!: Vehicle;
}

export class WorkOrderAdd {
    statusOrder!: string;
    estimatedCost!: number;
    realCost!: number;
    startDate!: string | Date;
    endDate!: string | Date;;
    comments!: string;
    workDescription!: WorkDescription[] | undefined;
    vehicle!: VehicleAdd;
}

export class WorkOrderEdit {
    idOrder!: number;
    statusOrder!: string;
    estimatedCost!: number;
    realCost!: number;
    startDate!: string | Date;;
    endDate!: string | Date;;
    comments!: string;
    workDescription!: WorkDescription[] | undefined;
    vehicle!: VehicleAdd;
}
