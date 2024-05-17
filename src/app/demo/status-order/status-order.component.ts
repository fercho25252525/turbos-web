import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/models/vehicle';
import { WorkOrder } from 'src/app/models/work-order';
import { CustomerService } from 'src/app/services/customer.service';
import { UserService } from 'src/app/services/user.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { WorkOrderService } from 'src/app/services/work-order.service';

interface EventItem {
  status?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-status-order',
  templateUrl: './status-order.component.html',
  styleUrls: ['./status-order.component.scss']
})
export default class StatusOrderComponent {
  workOrderAll: WorkOrder[] = [];
  workOrder: WorkOrder[] = [];
  workOrde!: WorkOrder;
  allVehicle: Vehicle[] = [];
  textFilter = ''
  flagDetails = false

  events!: EventItem[];
  event!: EventItem[];

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private customerservice: CustomerService,
    private workOrderService: WorkOrderService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    console.log(this.workOrde);
    
    this.getWorkOrder()
    this.loadEvents()
  }

  loadEvents(){
    this.events = [
      { status: 'Creado', icon: 'pi pi-home', color: '#13426F', image: 'game-controller.jpg' },
      { status: 'Proceso', icon: 'pi pi-spinner', color: '#13426F' },
      { status: 'Finalizado', icon: 'pi pi-check', color: '#13426F' },
      { status: 'Entregado', icon: 'pi pi-check-circle', color: '#13426F' },
      { status: 'Cancelado', icon: 'pi pi-times', color: '#13426F' }
    ];
  }

  getWorkOrder() {
    this.workOrderService.getWorkOrder()
      .subscribe({
        next: data => {
          this.workOrderAll = data.data;
          console.log(this.workOrderAll);

        }
      });
  }

  filterVehicle() {
    this.flagDetails = false
    this.loadEvents()
    if (this.textFilter !== '') {
      this.workOrder = this.workOrderAll.filter(vehicle => vehicle.vehicle.plate.toLocaleLowerCase().includes(this.textFilter))
      console.log(this.workOrder);
    }
  }

  viewStatusVehicle(workOrder: WorkOrder) {
    this.flagDetails = true
    this.workOrde = workOrder
    this.events.filter(event => {
      if (event.status === workOrder.statusOrder) {
        event.color = '#7B7D80';
        return true; 
      }
      return false;
    })
    this.workOrder = []

  }
}
