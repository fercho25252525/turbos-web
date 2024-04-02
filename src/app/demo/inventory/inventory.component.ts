import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Inventory, InventoryAdd, InventoryEdit, Providers } from 'src/app/models/inventory';
import { Provider, ProviderAdd, ProviderEdit } from 'src/app/models/provider';
import { InventoryService } from 'src/app/services/inventory.service';
import { ProviderService } from 'src/app/services/provider.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export default class InventoryComponent {
  inventory: Inventory[] = [];
  provider: Provider[] = [];
  newInventory!: InventoryAdd;
  newProvider!: Providers;
  editInventory!: InventoryEdit;
  inventoryEdit: Inventory = new Inventory();
  formCreateProduct!: FormGroup;
  formEditProduct!: FormGroup;
  minDate!: NgbDateStruct;

  loadingTableData = true;
  visibleModalCreate: boolean = false;
  visibleModalComment: boolean = false;
  visibleModalEdit: boolean = false;
  isVisibilityMenssageCreate = true;
  isVisibilityMenssageEdit = true;
  descriptoinModal!: string;
  datePurchaseDate!: {}


  constructor(private providerService: ProviderService,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
      const myJsDate = new Date();
      this.minDate = { year: myJsDate.getFullYear() - 10, month: myJsDate.getMonth() + 1, day: myJsDate.getDate() };
  }

  ngOnInit() {
    this.getInventory();
    this.getProvider();
    this.formGroupCreateProvider();
    this.formGroupEditProdut();
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
  getInventory() {
    this.inventoryService.getInventory()
      .subscribe({
        next: data => {
          this.inventory = data.data;          
        },
        error: error => {
        },
        complete: () => {
          this.loadingTableData = false
        }
      });
  }


  formGroupCreateProvider() {
    this.formCreateProduct = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      cuantityStock: ['', Validators.required],
      unitPrice: ['', Validators.required],
      purchaseDate: ['',  Validators.required],
      status: ['',  Validators.required],
      category: ['',  Validators.required],
      provider: [''],
    });
  }

  formGroupEditProdut() {    
    this.formEditProduct = this.fb.group({
      name: [this.inventoryEdit.name, Validators.required],
      description: [this.inventoryEdit.description],
      cuantityStock: [this.inventoryEdit.cuantityStock, Validators.required],
      unitPrice: [this.inventoryEdit.unitPrice, Validators.required],
      purchaseDate: [this.datePurchaseDate,  Validators.required],
      status: [this.inventoryEdit.status,  Validators.required],
      category: [this.inventoryEdit.category,  Validators.required],
      provider: [this.inventoryEdit.provider !== undefined ? this.inventoryEdit.provider.id: 0 ],
    });
  }


  createProduct() { 
    const purchaseDate = this.formCreateProduct.get('purchaseDate')?.value;

    this.newProvider = {
      id: this.formCreateProduct.get('provider')?.value
    }

    this.newInventory = {
      name: this.formCreateProduct.get('name')?.value,
      description: this.formCreateProduct.get('description')?.value,
      cuantityStock: this.formCreateProduct.get('cuantityStock')?.value,
      unitPrice: this.formCreateProduct.get('unitPrice')?.value,
      purchaseDate: new Date(purchaseDate.year, purchaseDate.month - 1, purchaseDate.day),
      status: this.formCreateProduct.get('status')?.value,
      category: this.formCreateProduct.get('category')?.value,
      provider: this.newProvider
    }    
 
    this.inventoryService.createInventory(this.newInventory).subscribe({
      next: data => {
        this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}` });
        this.visibleModalCreate = false;
        this.formCreateProduct.reset();
        this.getInventory();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
      },
      complete: () => {
      }
    });
  }

  updateProvider() {
    const purchaseDate = this.formEditProduct.get('purchaseDate')?.value;

    this.newProvider = {
      id: this.formEditProduct.get('provider')?.value
    }

    this.editInventory = {
      id: this.inventoryEdit.id,
      name: this.formEditProduct.get('name')?.value,
      description: this.formEditProduct.get('description')?.value,
      cuantityStock: this.formEditProduct.get('cuantityStock')?.value,
      unitPrice: this.formEditProduct.get('unitPrice')?.value,
      purchaseDate: new Date(purchaseDate.year, purchaseDate.month - 1, purchaseDate.day),
      status: this.formEditProduct.get('status')?.value,
      category: this.formEditProduct.get('category')?.value,
      provider: this.newProvider
    }

    console.log(this.editInventory);
    

    this.inventoryService.updateInventory(this.editInventory).subscribe(
      {
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}`, });
          this.visibleModalEdit = false;
          this.formEditProduct.reset();
          this.getInventory();
        },
        error:  error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
        },
        complete: () => {          
        }
      }  
    )
  }

  confirmDeleteUser(event: Event, inventory: Inventory) {
    this.confirmationService.confirm({         
      target: event.target as EventTarget,
      message: `¿Esta seguro de que desea borrar el producto ${inventory.name}?`,
      accept: () => {
        this.inventoryService.deleteInventory(inventory).subscribe(
          res => {
            this.getInventory();
            this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: `Se ha borrado el producto ${inventory.name}` });
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

  showDialogComment(comment: string) {
    this.descriptoinModal = comment;
    this.visibleModalComment = true;
  }

  showDialogEdit(inventory: Inventory) {  
    this.inventoryEdit = inventory; 
    const dateString = this.inventoryEdit.purchaseDate;     
    if (dateString !== null && dateString !== undefined) {
      const fecha = new Date(dateString.toString());
      this.datePurchaseDate = { year: fecha.getFullYear(), month: fecha.getMonth() + 1, day: fecha.getDate() }
    }

    this.formGroupEditProdut();
    this.visibleModalEdit = true;
  }

  closeDialogEdit() {
    this.visibleModalEdit = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
