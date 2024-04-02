import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Provider, ProviderAdd, ProviderEdit } from 'src/app/models/provider';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export default class ProviderComponent {

  provider: Provider[] = [];
  newProvider!: ProviderAdd;
  editProvider!: ProviderEdit;
  providerEdit: ProviderEdit = new ProviderEdit();
  formCreateProvider!: FormGroup;
  formEditProvider!: FormGroup;

  loadingTableData = true;
  visibleModalCreate: boolean = false;
  visibleModalEdit: boolean = false;
  isVisibilityMenssageCreate = true;
  isVisibilityMenssageEdit = true;


  constructor(private providerService: ProviderService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getProvider();
    this.formGroupCreateProvider();
    this.formGroupEditProvider();
    
  }

  getProvider() {
    this.providerService.getProvider()
      .subscribe({
        next: data => {
          this.provider = data.data;          
        },
        error: error => {
        },
        complete: () => {
          this.loadingTableData = false
        }
      });
  }


  formGroupCreateProvider() {
    this.formCreateProvider = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      additionalInfo: ['']
    });
  }

  formGroupEditProvider() {
    this.formEditProvider = this.fb.group({
      name: [this.providerEdit.name, Validators.required],
      address: [this.providerEdit.address, Validators.required],
      phone: [this.providerEdit.phone, Validators.required],
      email: [this.providerEdit.email, [Validators.required, Validators.email]],
      additionalInfo: [this.providerEdit.additionalInfo]
    });
  }

  createProvider() { 
    this.newProvider = {
      name: this.formCreateProvider.get('name')?.value,
      address: this.formCreateProvider.get('address')?.value,
      phone: this.formCreateProvider.get('phone')?.value,
      email: this.formCreateProvider.get('email')?.value,
      additionalInfo: this.formCreateProvider.get('additionalInfo')?.value,
    }
 
    this.providerService.createProvider(this.newProvider).subscribe({
      next: data => {
        this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}` });
        this.visibleModalCreate = false;
        this.formCreateProvider.reset();
        this.getProvider();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
      },
      complete: () => {
      }
    });
  }

  updateProvider() {
    console.log(this.providerEdit.id);
    this.editProvider = {
      id: this.providerEdit.id,
      name: this.formEditProvider.get('name')?.value,
      address: this.formEditProvider.get('address')?.value,
      phone: this.formEditProvider.get('phone')?.value,
      email: this.formEditProvider.get('email')?.value,
      additionalInfo: this.formEditProvider.get('additionalInfo')?.value,
    }

    this.providerService.updateProvider(this.editProvider).subscribe(
      {
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}`, });
          this.visibleModalEdit = false;
          this.formEditProvider.reset();
          this.getProvider();
        },
        error:  error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
        },
        complete: () => {          
        }
      }  
    )
  }

  confirmDeleteUser(event: Event, provider: Provider) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Esta seguro de que desea borrar el proveedor ${provider.name}?`,
      accept: () => {
        this.providerService.deleteProvider(provider).subscribe(
          res => {
            this.getProvider();
            this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: `Se ha borrado el proveedor ${provider.name}` });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
          }
        )
      }
    });
  }

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

  showDialogEdit(provider: ProviderEdit) {    
    this.providerEdit = provider;
    this.formGroupEditProvider();
    this.visibleModalEdit = true;
  }

  closeDialogEdit() {
    this.visibleModalEdit = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
