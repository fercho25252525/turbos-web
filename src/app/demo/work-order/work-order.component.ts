import { data } from './../../fack-db/series-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { Customer, CustomerAdd, User } from 'src/app/models/user';
import { Product, Vehicle, VehicleAdd } from 'src/app/models/vehicle';
import { WorkDescription, WorkDescriptionAdd } from 'src/app/models/work-description';
import { WorkOrder, WorkOrderAdd, WorkOrderEdit } from 'src/app/models/work-order';
import { CustomerService } from 'src/app/services/customer.service';
import { UserService } from 'src/app/services/user.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { WorkOrderService } from 'src/app/services/work-order.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export default class WorkOrderComponent {
  visibleModalCreate: boolean = false;
  visibleModalEdit: boolean = false;

  workOrder: WorkOrder[] = [];
  items: MenuItem[] | undefined;

  @ViewChild('tabView') tabView!: TabView;
  selectedIndex: number = 0;
  existClient: boolean = false;


  // customer
  newCustomer!: CustomerAdd;
  formCreateCustomer!: FormGroup;
  isVisibilityMenssageCreate = true;
  isVisibilityMenssageEdit = true;
  selectedImage!: File | null;
  selectedCustomer = true;
  selectedItem: Customer | null = null;
  filteredItems: Customer[] = [];
  allCustomers: Customer[] = [];
  selectedFilter: 'document' | 'name' = 'document'; // Por defecto, filtrar por número de documento
  nameButtonClient = 'Crear Usuario';
  createCustomerFlag = false;
  buttonCreateUser = true;

  // Vehicle
  newVihicle!: VehicleAdd;
  formCreateVehicle!: FormGroup;
  existVehicle: boolean = false;
  createVehicleFlag = false;
  nameButtonVehicle = 'Crear Vehiculo';
  selectedVehicle = true;
  buttonCreateVehicle = true;
  selectedItemVehicle: Vehicle | null = null;
  filteredItemsVehicle: Vehicle[] = [];
  allVehicle: Vehicle[] = [];

  //Orden 
  newOrder!: WorkOrderAdd;
  formCreateOrder!: FormGroup;
  nameButtonOrder = 'Crear Orden';

  //OrdenDescription
  newOrderDescription!: WorkDescriptionAdd;
  formCreateOrderDescription!: FormGroup;
  availableProducts: WorkDescription[] | undefined;
  selectedProducts: WorkDescription[] | undefined;
  draggedProduct: WorkDescription | undefined | null;
  mecanic: User[] = [];


  //EditOrder
  editOrder!: WorkOrderEdit;
  existClientEdit: boolean = false;

  // customer

  // newCustomer!: CustomerAdd;
  formEditCustomer!: FormGroup;
  // isVisibilityMenssageCreate = true;
  // isVisibilityMenssageEdit = true;
  // selectedImage!: File | null;
  selectedCustomerEdit = true;
  // selectedItem: Customer | null = null;
  // filteredItems: Customer[] = [];
  // allCustomers: Customer[] = [];
  // selectedFilter: 'document' | 'name' = 'document'; // Por defecto, filtrar por número de documento
  nameButtonClientEdit = 'Actualizar Usuario';
  EditCustomerFlag = false;
  buttonEditUser = false;

  // Vehicle

  // newVihicle!: VehicleAdd;
  formEditVehicle!: FormGroup;
  existVehicleEdit: boolean = false;
  // createVehicleFlag = false;
  // nameButtonVehicle = 'Crear Vehiculo';
  selectedVehicleEdit = true;
  buttonCreateVehicleEdit = true;
  // selectedItemVehicle: Vehicle | null = null;
  // filteredItemsVehicle: Vehicle[] = [];
  // allVehicle: Vehicle[] = [];

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private customerservice: CustomerService,
    private workOrderService: WorkOrderService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private confirmationService: ConfirmationService) {

    this.formCreateOrderDescription = this.fb.group({
      mechanic: [''] // Campo de formulario para el mecánico (ejemplo)
    });
  }

  ngOnInit() {
    this.addProductanddelete()
    this.getMecanic()
    this.loadAllCustomers()
    this.loadAllVehicle()
    this.formGroupCreateCustomer();
    this.formGroupEditCustomer();
    this.formGroupCreateVehicle();
    this.formGroupEditVehicle();
    this.formGroupCreateOrder();
    // this.formGroupCreateOrderDescriptions();
    this.getWorkOrder();
    this.getYearsRange()
    this.items = [
      {
        icon: 'pi pi-pencil',
        styleClass: 'custom-icon',
        tooltip: 'Editar',
        command: () => {
          console.log("entra edit");

          this.showDialogEdit();
        }
      },
      {
        icon: 'pi pi-trash',
        styleClass: 'custom-icon',
        tooltip: 'Eliminar',
        command: () => {
          this.customerservice.deleteUser(this.editOrder).subscribe(
            res => {
              this.getWorkOrder();
              this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: `Se ha borrado el usuario ${this.editOrder.idOrder}` });
            },
            error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
            }
          )
        }

      },
      {
        icon: 'pi pi-eye',
        styleClass: 'custom-icon',
        tooltip: 'Ver',
        command: () => console.log()

      }
    ];
  }


  getMecanic() {
    this.userService.getMecanic().subscribe(
      (mecanic: { data: any[] }) => {
        this.mecanic = mecanic.data
        console.log(this.mecanic);
      },
      (error) => {
        console.error('Error al obtener clientes', error);
        this.allVehicle = [];
      }
    );

    console.log(this.mecanic);

  }



  addProductanddelete() {
    this.selectedProducts = [];
    this.availableProducts = [
      { idWork: 1, typeWork: 'Cambio de aceite', coste: 50000 },
      { idWork: 2, typeWork: 'Cambio de filtros', coste: 250.000 },
      { idWork: 3, typeWork: 'Revisión y Mantenimiento de Lubricación', coste: 40.000 },
      { idWork: 4, typeWork: 'Mantenimiento de motor', coste: 20.000 },
      { idWork: 5, typeWork: 'Turbo', coste: 5.000 },
      { idWork: 6, typeWork: 'Consultoria técnica', coste: 950.000 },

    ]
  }

  dragStart(event: any, product: WorkDescription) {
    this.draggedProduct = product;
  }

  dropAvailable(event: any) {
    if (this.draggedProduct) {
      // Move from selectedProducts back to availableProducts
      if (!this.availableProducts!.includes(this.draggedProduct)) {
        this.selectedProducts = this.selectedProducts!.filter(p => p !== this.draggedProduct);
        this.availableProducts!.push(this.draggedProduct);
      }
      this.draggedProduct = undefined;
    }
  }

  dropSelected(event: any) {
    if (this.draggedProduct) {
      // Move from availableProducts to selectedProducts
      if (!this.selectedProducts!.includes(this.draggedProduct)) {
        this.availableProducts = this.availableProducts!.filter(p => p !== this.draggedProduct);
        const selectedProductWithDetails: WorkDescription = { ...this.draggedProduct, mec: '' };
        this.selectedProducts!.push(selectedProductWithDetails);
      }
      console.log(this.selectedProducts);

      this.draggedProduct = undefined;
    }
  }

  updateDetails(product: WorkDescription) {
    const mechanicValue = this.formCreateOrderDescription.get('mechanic')?.value;
    if (mechanicValue) {
      product.mechanic = mechanicValue;
      product.coste = product.coste
      product.typeWork = product.typeWork
    }

    console.log(product);

  }

  dragEnd() {
    this.draggedProduct = undefined;
  }




  yearsList: number[] = [];
  getYearsRange(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    this.yearsList = [];

    for (let year = startYear; year <= currentYear; year++) {
      this.yearsList.push(year);
    }

    console.log('Lista de años:', this.yearsList);
  }

  filterItems(event: any) {
    const query = event.query.toLowerCase().trim();

    // Filtrar por nombre o número de documento combinados
    this.filteredItems = this.allCustomers.filter(
      (customer: Customer) => {
        const fullName = customer.fullName.toLowerCase(); // Acceder a fullName
        return fullName.includes(query);
      }
    );
  }

  filterItemsVehicle(event: any) {
    const query = event.query.toLowerCase().trim();


    this.filteredItemsVehicle = this.allVehicle.filter(
      (vehicle: Vehicle) => {
        const plate = vehicle.plate; // Acceder a fullName
        return plate.includes(query);
      }
    );
  }



  // Función para cambiar el tipo de filtro
  changeFilter(type: 'document' | 'name') {
    this.selectedFilter = type;
    // Limpiar el campo de búsqueda al cambiar el tipo de filtro
    this.filteredItems = [];
  }

  loadAllCustomers() {
    this.customerservice.getCustomer().subscribe(
      (customers: { data: any[] }) => {
        // Mapear los datos recibidos a instancias de Customer
        this.allCustomers = customers.data.map(
          (data: any) => new Customer(data.name, data.lastName, data.email, data.documentNumber, data.gender, data.phone, data.address)
        );
      },
      (error) => {
        console.error('Error al obtener clientes', error);
        this.allCustomers = [];
      }
    );
  }

  loadAllVehicle() {
    this.vehicleService.getVehicle().subscribe(
      (vehicle: { data: any[] }) => {
        // Mapear los datos recibidos a instancias de Customer
        this.allVehicle = vehicle.data
      },
      (error) => {
        console.error('Error al obtener clientes', error);
        this.allVehicle = [];
      }
    );
  }

  onCustomerSelect(event: any) {
    // El evento contiene el cliente seleccionado
    this.selectedItem = event.value;

    this.newCustomer = {
      userName: this.selectedItem?.documentNumber || '',
      name: this.selectedItem?.name || '',
      lastName: this.selectedItem?.lastName || '',
      email: this.selectedItem?.email || '',
      documentNumber: this.selectedItem?.documentNumber || '',
      gender: this.selectedItem?.gender || '',
      address: this.selectedItem?.address || '',
      phone: this.selectedItem?.phone || '',
    }

    this.formGroupCreateCustomer()
    this.existClient = true;
    this.createCustomerFlag = false;
    this.buttonCreateUser = false
    this.selectedCustomer = false;
    this.irAlSegundoTab(1)
  }

  onVehicleSelect(event: any) {
    // El evento contiene el cliente seleccionado
    this.selectedItemVehicle = event.value;
    console.log(this.selectedItemVehicle);

    this.newVihicle = {
      plate: this.selectedItemVehicle?.plate || '',
      brand: this.selectedItemVehicle?.brand || '',
      color: this.selectedItemVehicle?.color || '',
      city: this.selectedItemVehicle?.city || '',
      model: this.selectedItemVehicle?.model || '',
      nextMaintenanceDate: this.selectedItemVehicle?.nextMaintenanceDate || new Date(),
      status: this.selectedItemVehicle?.status || '',
      typeVehicle: this.selectedItemVehicle?.typeVehicle || '',
      typeFuels: this.selectedItemVehicle?.typeFuels || '',
      customer: this.newCustomer
    }

    this.formGroupCreateVehicle()
    this.existVehicle = true;
    this.createVehicleFlag = false;
    this.buttonCreateVehicle = false
    this.selectedVehicle = false;
    this.irAlSegundoTab(2)
  }

  irAlSegundoTab(index: number) {

    this.selectedIndex = index;
    this.tabView.activeIndex = this.selectedIndex;
  }

  flagCreateClient() {
    this.selectedCustomer = true
    this.buttonCreateUser = true;
    this.formCreateCustomer.reset();
    this.existClient = !this.existClient;

    if (!this.existClient) {
      this.nameButtonClient = 'Crear Usuario'
    } else {
      this.nameButtonClient = 'Seleccionar Usuario'
    }
  }

  flagCreateVehicle() {
    this.selectedVehicle = true
    this.buttonCreateVehicle = true;
    this.formCreateVehicle.reset();
    this.existVehicle = !this.existVehicle;

    if (!this.existVehicle) {
      this.nameButtonVehicle = 'Crear Vehiculo'
    } else {
      this.nameButtonVehicle = 'Seleccionar Vehiculo'
    }
  }

  flagCreateOrder() {
    this.selectedVehicle = true
    this.buttonCreateVehicle = true;
    this.formCreateVehicle.reset();
    this.existVehicle = !this.existVehicle;

    if (!this.existVehicle) {
      this.nameButtonVehicle = 'Crear Orden'
    } else {
      this.nameButtonVehicle = 'Seleccionar Orden'
    }
  }


  generateCommand(order: any) {
    this.editOrder = order;
    console.log(this.editOrder);
  }

  getWorkOrder() {
    this.workOrderService.getWorkOrder()
      .subscribe({
        next: data => {
          this.workOrder = data.data;
          console.log(this.workOrder);

        },
        error: error => {
        },
        complete: () => {
          // this.customers.forEach(customer => {
          //   this.getPhotoUser(customer.userName);
          // });

          // console.log(this.customers)
        }
      });
  }

  formGroupCreateCustomer() {
    this.formCreateCustomer = this.fb.group({
      name: [{ value: this.newCustomer !== undefined ? this.newCustomer.name : '', disabled: !this.selectedCustomer }, Validators.required],
      lastName: [{ value: this.newCustomer !== undefined ? this.newCustomer.lastName : '', disabled: !this.selectedCustomer }, Validators.required],
      username: [],
      email: [{ value: this.newCustomer !== undefined ? this.newCustomer.email : '', disabled: !this.selectedCustomer }, [Validators.required, Validators.email]],
      document: [{ value: this.newCustomer !== undefined ? this.newCustomer.documentNumber : '', disabled: !this.selectedCustomer }, Validators.required],
      gender: [{ value: this.newCustomer !== undefined ? this.newCustomer.gender : '', disabled: !this.selectedCustomer }],
      phone: [{ value: this.newCustomer !== undefined ? this.newCustomer.phone : '', disabled: !this.selectedCustomer }, Validators.required],
      address: [{ value: this.newCustomer !== undefined ? this.newCustomer.address : '', disabled: !this.selectedCustomer }],
      photo: [{ value: '', disabled: !this.selectedCustomer }],
    });
  }


  formGroupEditCustomer() {
    console.log(this.editOrder);

    this.formEditCustomer = this.fb.group({
      name: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.name : '', disabled: this.selectedCustomerEdit }, Validators.required],
      lastName: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.lastName : '', disabled: this.selectedCustomerEdit }, Validators.required],
      username: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.userName : '', disabled: this.selectedCustomerEdit }],
      email: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.email : '', disabled: this.selectedCustomerEdit }, [Validators.required, Validators.email]],
      document: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.documentNumber : '', disabled: this.selectedCustomerEdit }, Validators.required],
      gender: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.gender : '', disabled: this.selectedCustomerEdit }],
      phone: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.phone : '', disabled: this.selectedCustomerEdit }, Validators.required],
      address: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.customer.address : '', disabled: this.selectedCustomerEdit }],
      photo: [''],
    });
  }

  formGroupCreateVehicle() {
    this.formCreateVehicle = this.fb.group({
      plate: [{ value: this.newVihicle !== undefined ? this.newVihicle.plate : '', disabled: !this.selectedVehicle }, Validators.required],
      brand: [{ value: this.newVihicle !== undefined ? this.newVihicle.brand : '', disabled: !this.selectedVehicle }, Validators.required],
      color: [{ value: this.newVihicle !== undefined ? this.newVihicle.color : '', disabled: !this.selectedVehicle }],
      city: [{ value: this.newVihicle !== undefined ? this.newVihicle.city : '', disabled: !this.selectedVehicle }, Validators.required],
      model: [{ value: this.newVihicle !== undefined ? this.newVihicle.model : '', disabled: !this.selectedVehicle }, Validators.required],
      nextMaintenanceDate: [{ value: this.newVihicle !== undefined ? this.newVihicle.nextMaintenanceDate : '', disabled: !this.selectedVehicle }],
      status: [{ value: this.newVihicle !== undefined ? this.newVihicle.status : '', disabled: !this.selectedVehicle }],
      typeVehicle: [{ value: this.newVihicle !== undefined ? this.newVihicle.typeVehicle : '', disabled: !this.selectedVehicle }, Validators.required],
      typeFuels: [{ value: this.newVihicle !== undefined ? this.newVihicle.typeFuels : '', disabled: !this.selectedVehicle }, Validators.required],
    });
  }

  formGroupEditVehicle() {
    this.formEditVehicle = this.fb.group({
      plate: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.plate : '', disabled: this.formGroupEditVehicle }, Validators.required],
      brand: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.brand : '', disabled: this.formGroupEditVehicle }, Validators.required],
      color: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.color : '', disabled: this.formGroupEditVehicle }],
      city: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.city : '', disabled: this.formGroupEditVehicle }, Validators.required],
      model: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.model : '', disabled: this.formGroupEditVehicle }, Validators.required],
      nextMaintenanceDate: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.nextMaintenanceDate : '', disabled: this.formGroupEditVehicle }],
      status: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.status : '', disabled: this.formGroupEditVehicle }],
      typeVehicle: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.typeVehicle : '', disabled: this.formGroupEditVehicle }, Validators.required],
      typeFuels: [{ value: this.editOrder !== undefined ? this.editOrder.vehicle.typeFuels : '', disabled: this.formGroupEditVehicle }, Validators.required],
    });
  }

  formGroupCreateOrder() {
    this.formCreateOrder = this.fb.group({
      statusOrder: ['Creado', Validators.required],
      estimatedCost: ['', Validators.required],
      realCost: [0],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      comments: [''],
    });
  }

  // formGroupCreateOrderDescriptions() {
  //   this.formCreateOrderDescription = this.fb.group({
  //     mechanic: [''] // Campo de formulario para el mecánico (ejemplo)
  //   });
  // }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file: File = target.files[0];
      const fileSizeInMB: number = file.size / (1024 * 1024);
      const maxFileSizeMB = 2;
      console.log("este es el type: " + file.type);

      if ((file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') && fileSizeInMB <= maxFileSizeMB) {
        this.selectedImage = file;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Tipo o peso de archivo invalido solo se aceptan imagenes png, jpg con un peso máximo de 2MB` });
      }
    }
  }


  createCustomer() {
    this.newCustomer = {
      userName: this.formCreateCustomer.get('document')?.value,
      name: this.formCreateCustomer.get('name')?.value,
      lastName: this.formCreateCustomer.get('lastName')?.value,
      email: this.formCreateCustomer.get('email')?.value,
      documentNumber: this.formCreateCustomer.get('document')?.value,
      gender: this.formCreateCustomer.get('gender')?.value,
      address: this.formCreateCustomer.get('address')?.value,
      phone: this.formCreateCustomer.get('phone')?.value,
    }

    console.log(this.newCustomer);

    this.customerservice.createCustomer(this.newCustomer).subscribe({
      next: data => {
        console.log(data);
        this.selectedCustomer = false;
        this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}` });
        this.formGroupCreateCustomer()
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
      },
      complete: () => {
        this.irAlSegundoTab(1)
        this.selectedImage = null;
        this.createCustomerFlag = true;
      }
    });
  }

  createVehicle() {
    const date = this.formCreateVehicle.get('nextMaintenanceDate')?.value
    this.selectedVehicle = false;
    this.newVihicle = {
      plate: this.formCreateVehicle.get('plate')?.value,
      brand: this.formCreateVehicle.get('brand')?.value,
      color: this.formCreateVehicle.get('color')?.value,
      city: this.formCreateVehicle.get('city')?.value,
      model: this.formCreateVehicle.get('model')?.value,
      nextMaintenanceDate: date !== null && date !== undefined ? new Date(date.year, date.month - 1, date.day) : '',
      status: this.formCreateVehicle.get('status')?.value,
      typeVehicle: this.formCreateVehicle.get('typeVehicle')?.value,
      typeFuels: this.formCreateVehicle.get('typeFuels')?.value,
      customer: this.newCustomer
    }
    console.log(this.newVihicle);

    this.irAlSegundoTab(2)
    this.createVehicleFlag = true;
  }

  createOrder() {
    const startDate = this.formCreateOrder.get('startDate')?.value
    const endDate = this.formCreateOrder.get('endDate')?.value
    // this.selectedVehicle = false;
    this.newOrder = {
      statusOrder: this.formCreateOrder.get('statusOrder')?.value,
      estimatedCost: this.formCreateOrder.get('estimatedCost')?.value,
      realCost: this.formCreateOrder.get('realCost')?.value,
      startDate: startDate !== null && startDate !== undefined ? new Date(startDate.year, startDate.month - 1, startDate.day) : '',
      endDate: endDate !== null && endDate !== undefined ? new Date(endDate.year, endDate.month - 1, endDate.day) : '',
      comments: this.formCreateOrder.get('comments')?.value,
      workDescription: [],
      vehicle: this.newVihicle,
    }
    console.log(this.newOrder);

    this.irAlSegundoTab(3)
    // this.createVehicleFlag = true;
  }


  createOrderDetail() {

    console.log(this.selectedProducts);

    this.newOrder.workDescription = this.selectedProducts

    console.log(this.newOrder);


    this.workOrderService.createWorkOrder(this.newOrder).subscribe(
      {
        next: data => {
          console.log(data);

          this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}`, });
          this.getWorkOrder();
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
        },
        complete: () => {
          this.visibleModalCreate = false;
          this.formCreateCustomer.reset();
          this.formCreateVehicle.reset();
          this.formCreateOrder.reset();
          this.formCreateOrderDescription.reset();
        }
      }
    )
  }

  confirmDeleteUser(event: Event, user: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro de que desea borrar el usuario ${user.userName}?`,
      accept: () => {
        this.userService.deleteUser(user).subscribe(
          res => {
            this.getWorkOrder();
            this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: `Se ha borrado el usuario ${user.userName}` });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
          }
        )
      }
    });
  }

  showDialogCreate() {
    this.visibleModalCreate = true;
  }

  showDialogEdit() {
    this.visibleModalEdit = true;
    this.formGroupEditCustomer()
    this.formGroupEditVehicle()
  }


  showVisibilityMenssageCreate() {
    this.isVisibilityMenssageCreate = !this.isVisibilityMenssageCreate;
  }

  showVisibilityMenssageEdit() {
    this.isVisibilityMenssageEdit = !this.isVisibilityMenssageEdit;
  }

  closeDialogCreate() {
    this.visibleModalCreate = false;
  }

  closeDialogEdit() {
    this.visibleModalEdit = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 
