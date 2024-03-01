import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Message, MessageService, SharedModule } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export default class UserComponent {

  customers!: Customer[];
  visibleCreate: boolean = false;
  visibleEdit: boolean = false;
  formCreateUser!: FormGroup;
  formEditUser!: FormGroup;
  isVisibilityMenssageCreate = true;
  isVisibilityMenssageEdit = true;
  value!: string;

  constructor(private customerService: CustomerService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.customerService.getCustomersLarge().then((customers) => (this.customers = customers));
    this.formCreateUser = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      statuss: ['', Validators.required],
    });

    this.formEditUser = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      enabled: [1, Validators.required],
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
    this.visibleCreate = true;
  }

  closeDialogCreate() {
    this.visibleCreate = false;
  }

  showDialogEdit() {
    this.visibleEdit = true;
    console.log("este: " +  this.formEditUser.get('enabled')?.value);
    
    // this.value = this.formEditUser.get('enabled')?.value;
  }

  closeDialogEdit() {
    this.visibleEdit = false;
  }

  enviarFormulario() {
    console.log(this.formCreateUser.value);
    // console.log(this.value);
  }

}
