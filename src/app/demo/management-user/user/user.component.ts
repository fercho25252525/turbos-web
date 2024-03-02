import { data } from './../../../fack-db/series-data';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { log } from 'console';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ConfirmationService, Message, MessageService, SharedModule } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { UserService } from 'src/app/services/user.service';
import { Role, User, UserAdd } from 'src/app/models/user';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export default class UserComponent implements OnInit {
  users: User[] = [];
  role: Role[] = [];
  newUser!: UserAdd;
  newRole!: Role[];
  formCreateUser!: FormGroup;
  formEditUser!: FormGroup;

  loadingTableData = true;
  visibleModalCreate: boolean = false;
  visibleModalEdit: boolean = false;
  isVisibilityMenssageCreate = true;
  isVisibilityMenssageEdit = true;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.getUsers();
    this.getRole();
    this.formGroupCreateUser();
    this.formGroupEditUser();
  }

  getUsers() {
    this.userService.getUsers()
      .subscribe({
        next: data => {
          this.users = data.data;
          console.log('Datos obtenidos:', this.users);
        },
        error: error => {
          console.error('Error al obtener datos:', error);
        },
        complete: () => this.loadingTableData = false
      });
  }

  getRole() {
    this.userService.getRole()
      .subscribe({
        next: data => {
          this.role = data.data;
          console.log('Datos obtenidos:', this.role);
        },
        error: error => {
          console.error('Error al obtener datos:', error);
        },
        complete: () => this.loadingTableData = false
      });
  }

  formGroupEditUser() {
    this.formEditUser = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      role: ['', Validators.required],
      enabled: [1, Validators.required],
    });
  }


  formGroupCreateUser() {
    this.formCreateUser = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      role: [, Validators.required],
      statuss: ['', Validators.required],
    });
  }


  createUser() {
    const role = this.formCreateUser.get('role')?.value
    const birthDate = this.formCreateUser.get('birthDate')?.value

    this.newRole = [{
      id: role.id,
      name: role.name
    }]

    const birthDateFormat = new Date(birthDate.year, birthDate.month - 1, birthDate.day);
    
    this.newUser = {
      userName: this.formCreateUser.get('username')?.value,
      name: this.formCreateUser.get('name')?.value,
      lastName: this.formCreateUser.get('lastName')?.value,
      email: this.formCreateUser.get('email')?.value,
      documentNumber: this.formCreateUser.get('document')?.value,
      gender: this.formCreateUser.get('gender')?.value,
      photo: this.formCreateUser.get('username')?.value,
      birthDate: birthDateFormat.toString(),
      role: this.newRole,
    }
    console.log(JSON.stringify(this.newUser));

    this.userService.createUser(this.newUser).subscribe(
      data =>{
        console.log(data);
        this.visibleModalCreate = false;
        this.formCreateUser.reset();
        this.getUsers();
      }
     
    )

  }

  confirmDeleteUser(event: Event, userName: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro de que desea borrar el usuario ${userName}?`,
      // icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: `Se ha borrado el usuario ${userName}` });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

  statusUserOpctions: any[] = [
    { icon: 'feather icon-user-check', value: 1 },
    { icon: 'feather icon-user-x', value: 0 }
  ];

  showVisibilityMenssageCreate() {
    this.isVisibilityMenssageCreate = !this.isVisibilityMenssageCreate;
  }

  showVisibilityMenssageEdit() {
    this.isVisibilityMenssageEdit = !this.isVisibilityMenssageEdit;
  }

  showDialogCreate() {
    this.visibleModalCreate = true;
  }

  closeDialogCreate() {
    this.visibleModalCreate = false;
  }

  showDialogEdit() {
    this.visibleModalEdit = true;
  }

  closeDialogEdit() {
    this.visibleModalEdit = false;
  }
}
