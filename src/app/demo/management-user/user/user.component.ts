import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'primeng/api';
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
  visible: boolean = false;
  formCreateUser!: FormGroup;

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
    });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
  }

  enviarFormulario() {
    // Lógica para manejar el envío del formulario
    console.log(this.formCreateUser.value);
  }

}
