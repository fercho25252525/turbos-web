import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Customer, CustomerAdd } from 'src/app/models/user';
import { CustomerService } from 'src/app/services/customer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export default class CustomerComponent implements OnInit {

  defaultImgMen: string = '/assets/images/user/predeterminadoHombre.png';
  defaultImgWoman: string = '/assets/images/user/predeterminadoMujer.png';
  defaultImgIndefined: string = '/assets/images/user/predeterminadoIndefinido.png';

  formCreateCustomer!: FormGroup;
  formEditCustomer!: FormGroup;
  visibleModalCreate: boolean = false;
  visibleModalEdit: boolean = false;
  minDate!: NgbDateStruct;
  newCustomer!: CustomerAdd;
  editCustomerr: CustomerAdd = new CustomerAdd();
  updateCustomer!: CustomerAdd;
  customers: Customer[] = [];


  isVisibilityMenssageCreate = true;
  isVisibilityMenssageEdit = true;
  selectedImage!: File | null;

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private customerservice: CustomerService,
    private userService: UserService,
    private confirmationService: ConfirmationService) {
  }

  items: MenuItem[] | undefined;

  generateCommand(customer: any) {
    this.editCustomerr = customer;
  }

  ngOnInit() {
    this.formGroupCreateCustomer();
    this.formGroupEditCustomer();
    this.getCustomer();

    this.items = [
      {
        icon: 'pi pi-pencil',
        styleClass: 'custom-icon',
        tooltip: 'Editar',
        command: () => {
          this.showDialogEdit(this.editCustomerr);
        }
      },
      {
        icon: 'pi pi-trash',
        styleClass: 'custom-icon',
        tooltip: 'Eliminar',
        command: () => {
          this.customerservice.deleteUser(this.editCustomerr).subscribe(
            res => {
              this.getCustomer();
              this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: `Se ha borrado el usuario ${this.editCustomerr.userName}` });
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

  getCustomer() {
    this.customerservice.getCustomer()
      .subscribe({
        next: data => {
          this.customers = data.data;
          console.log(this.customers);

        },
        error: error => {
        },
        complete: () => {
          this.customers.forEach(customer => {
            this.getPhotoUser(customer.userName);
          });

          console.log(this.customers)
        }
      });
  }

  getPhotoUser(username: string): void {
    this.userService.getImage(username)
      .subscribe(
        imagen => {
          const customer = this.customers.find(u => u.userName === username);
          if (customer) {
            customer.photo = URL.createObjectURL(imagen);
          }
        });
  }

  getImgUser(customer: Customer): string {
    if (customer.gender === 'Hombre') {
      return customer.photo || this.defaultImgMen;
    } else if (customer.gender === 'Mujer') {
      return customer.photo || this.defaultImgWoman;
    } else {
      return customer.photo || this.defaultImgIndefined;
    }
  }


  formGroupCreateCustomer() {
    this.formCreateCustomer = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      gender: [''],
      phone: ['', Validators.required],
      address: [''],
      photo: [],
    });
  }

  formGroupEditCustomer() {
    this.formEditCustomer = this.fb.group({
      name: [this.editCustomerr.name, Validators.required],
      lastName: [this.editCustomerr.lastName, Validators.required],
      username: [this.editCustomerr.userName],
      email: [this.editCustomerr.email, [Validators.required, Validators.email]],
      document: [this.editCustomerr.documentNumber, Validators.required],
      gender: [this.editCustomerr.gender],
      phone: [this.editCustomerr.phone, Validators.required],
      address: [this.editCustomerr.address],
      photo: [],
    });
  }



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

        this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}` });
        this.visibleModalCreate = false;
        this.formCreateCustomer.reset();
        this.getCustomer();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
      },
      complete: () => {
        if (this.selectedImage) {
          this.uploadImage(this.newCustomer.userName);
          (async () => {
            await this.delay(1000);
            this.getCustomer();
          })();
        }

        this.selectedImage = null;
      }
    });
  }

  editCustomer() {

    this.updateCustomer = {
      userName: this.formEditCustomer.get('document')?.value,
      name: this.formEditCustomer.get('name')?.value,
      lastName: this.formEditCustomer.get('lastName')?.value,
      email: this.formEditCustomer.get('email')?.value,
      documentNumber: this.formEditCustomer.get('document')?.value,
      gender: this.formEditCustomer.get('gender')?.value,
      address: this.formEditCustomer.get('address')?.value,
      phone: this.formEditCustomer.get('phone')?.value,
    }

    console.log(this.updateCustomer);

    this.customerservice.updateUser(this.updateCustomer).subscribe({
      next: data => {
        console.log(data);

        this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}` });
        this.visibleModalEdit = false;
        this.formEditCustomer.reset();
        this.getCustomer();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
      },
      complete: () => {
        if (this.selectedImage) {
          this.uploadImage(this.newCustomer.userName);
          (async () => {
            await this.delay(1000);
            this.getCustomer();
          })();
        }

        this.selectedImage = null;
      }
    });
  }

  uploadImage(userName: string): void {
    if (this.selectedImage) {
      this.userService.uploadImage(this.selectedImage, userName).subscribe({
        next: data => {
        },
        error: error => {
          console.error('Error al cargar la imagen:', error);
        }
      });
    }
  }

  confirmDeleteUser(event: Event, user: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro de que desea borrar el usuario ${user.userName}?`,
      accept: () => {
        this.userService.deleteUser(user).subscribe(
          res => {
            this.getCustomer();
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

  showDialogEdit(user: CustomerAdd) {
    this.editCustomerr = user;
    console.log(this.editCustomerr);

    this.visibleModalEdit = true;
    this.formGroupEditCustomer();
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
