import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { Role, User, UserAdd, UserEdit } from 'src/app/models/user';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export default class UserComponent implements OnInit {

  defaultImgMen: string = '/assets/images/user/predeterminadoHombre.png';
  defaultImgWoman: string = '/assets/images/user/predeterminadoMujer.png';
  defaultImgIndefined: string = '/assets/images/user/predeterminadoIndefinido.png';
  
  users: User[] = [];
  role: Role[] = []; 
  newUser!: UserAdd;
  editUser!: UserEdit;
  newRole!: Role[];
  userEdit: UserEdit = new UserEdit();
  formCreateUser!: FormGroup;
  formEditUser!: FormGroup;

  loadingTableData = true;
  visibleModalCreate: boolean = false;
  visibleModalEdit: boolean = false;
  isVisibilityMenssageCreate = true;
  isVisibilityMenssageEdit = true;
  dateBirt!: {}
  minDate!: NgbDateStruct;

  selectedImage!: File | null;
  imageUrl!: string;


  constructor(private userService: UserService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    const myJsDate = new Date();
    this.minDate = { year: myJsDate.getFullYear() - 80, month: myJsDate.getMonth() + 1, day: myJsDate.getDate() };
  }

  ngOnInit() {
    this.getUsers();
    this.getRole();
    this.formGroupCreateUser();
    this.formGroupEditUser();
    
  }

  onFileSelectedfg(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files[0];
      this.userService.uploadImage(file, 'admin').subscribe(
      );
    }
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


  // getImage(userName: string):  void {
  //   this.userService.getImage(userName).subscribe(
  //     (response: Blob) => {

        
  //       this.imageUrl = URL.createObjectURL(response);
  //       // console.log("imagen: " + this.imageUrl);
  //     },
  //     (error) => {
  //       console.error('Error al obtener la imagen:', error);
  //     }
  //   );
  // }


  //obtener la imagen del useuario si no tiene foo se le asigna una predeterminada
  getImgUser(user: User): string {
    if (user.gender === 'Hombre') {
      return user.photo || this.defaultImgMen;
    } else if (user.gender === 'Mujer') {
      return user.photo || this.defaultImgWoman;
    } else {
      return user.photo || this.defaultImgIndefined;
    }
  }

  getPhotoUser(username: string): void {
    this.userService.getImage(username)
      .subscribe(
        imagen => {
        const user = this.users.find(u => u.userName === username);
        if (user) {
          user.photo = URL.createObjectURL(imagen);
        }
      });
  }

  // getImage(userName: string): Observable<string> {
  //   return this.userService.getImage(userName).pipe(
  //     map((response: Blob) => {
  //       this.imageUrl = URL.createObjectURL(response);
  //       return this.imageUrl;
  //     }),
  //     catchError((error) => {
  //       console.error('Error al obtener la imagen:', error);
  //       // Puedes emitir un valor por defecto o relanzar el error según lo que necesites
  //       return throwError('Error al obtener la imagen');
  //     })
  //   );
  // }

  getUsers() {
    this.userService.getUsers()
      .subscribe({
        next: data => {
          this.users = data.data;          
        },
        error: error => {
        },
        complete: () => {
          this.loadingTableData = false
          this.users.forEach(usuario => {
            this.getPhotoUser(usuario.userName);
          });
      
          console.log(this.users)
        }
      });
  }

  getRole() {
    this.userService.getRole()
      .subscribe({
        next: data => {
          this.role = data.data;
        },
        error: error => {
        },
        complete: () => this.loadingTableData = false
      });
  }


  formGroupCreateUser() {
    this.formCreateUser = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      gender: [''],
      birthDate: [],
      photo: [],
      role: ['']
    });
  }

  formGroupEditUser() {
    this.formEditUser = this.fb.group({
      name: [this.userEdit.name, Validators.required],
      lastName: [this.userEdit.lastName, Validators.required],
      username: [this.userEdit.userName, Validators.required],
      email: [this.userEdit.email, [Validators.required, Validators.email]],
      document: [this.userEdit.documentNumber, Validators.required],
      gender: [this.userEdit.gender],
      birthDate: [this.dateBirt],
      role: [this.userEdit.role == null ? '' : this.userEdit.role[0].id, Validators.required],
      enabled: [this.userEdit.enabled, Validators.required],
    });
  }

  createUser() {
    const role = this.formCreateUser.get('role')?.value
    const birthDate = this.formCreateUser.get('birthDate')?.value

    this.newRole = [{
      id: role.id,
      name: role.name
    }]

    let birthDateFormat = null;

    if (birthDate !== null && birthDate !== undefined) {
      birthDateFormat = new Date(birthDate.year, birthDate.month - 1, birthDate.day).toString();
    }


    this.newUser = {
      userName: this.formCreateUser.get('username')?.value,
      name: this.formCreateUser.get('name')?.value,
      lastName: this.formCreateUser.get('lastName')?.value,
      email: this.formCreateUser.get('email')?.value,
      documentNumber: this.formCreateUser.get('document')?.value,
      gender: this.formCreateUser.get('gender')?.value,
      birthDate: birthDateFormat,
      role: this.newRole,
    }
 
    this.userService.createUser(this.newUser).subscribe({
      next: data => {
        this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}` });
        this.visibleModalCreate = false;
        this.formCreateUser.reset();
        this.getUsers();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
      },
      complete: () => {
        if (this.selectedImage) {          
          this.uploadImage(this.newUser.userName);
          (async () => {
            await this.delay(1000);
            this.getUsers();
          })();
        }

        this.selectedImage = null;
      }
    });
  }

  updateUser() {
    const role = this.formEditUser.get('role')?.value as number | undefined
    const birthDate = this.formEditUser.get('birthDate')?.value

    const objetoEncontrado = this.role.find(objeto => objeto.id === role);

    this.newRole = [{
      id: objetoEncontrado?.id,
      name: objetoEncontrado?.name
    }]

    let birthDateFormat = null;

    if (birthDate !== null && birthDate !== undefined) {
      birthDateFormat = new Date(birthDate.year, birthDate.month - 1, birthDate.day).toString();
    }

    this.editUser = {
      userName: this.formEditUser.get('username')?.value,
      name: this.formEditUser.get('name')?.value,
      lastName: this.formEditUser.get('lastName')?.value,
      email: this.formEditUser.get('email')?.value,
      documentNumber: this.formEditUser.get('document')?.value,
      gender: this.formEditUser.get('gender')?.value,
      photo: this.formEditUser.get('username')?.value,
      birthDate: birthDateFormat,
      enabled: this.formEditUser.get('enabled')?.value,
      role: this.newRole,
    }

    this.userService.updateUser(this.editUser).subscribe(
      {
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}`, });
          this.visibleModalEdit = false;
          this.formCreateUser.reset();
          this.getUsers();
        },
        error:  error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
        },
        complete: () => {          
          if (this.selectedImage) {          
            this.uploadImage(this.editUser.userName);
            (async () => {
              await this.delay(1000);
              this.getUsers();
            })();            
          }
  
          this.selectedImage = null;
        }
      }  
    )
  }

  confirmDeleteUser(event: Event, user: User) {
    console.log(JSON.stringify(event)+"");
    this.confirmationService.confirm({
      
      
      target: event.target as EventTarget,
      message: `¿Esta seguro de que desea borrar el usuario ${user.userName}?`,
      accept: () => {
        this.userService.deleteUser(user).subscribe(
          res => {
            this.getUsers();
            this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: `Se ha borrado el usuario ${user.userName}` });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}` });
          }
        )
      }
    });
  }

  statusUserOpctions: any[] = [
    { icon: 'feather icon-user-check', value: true },
    { icon: 'feather icon-user-x', value: false }
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

  showDialogEdit(user: UserEdit) {
    this.userEdit = user;
    const dateString = this.userEdit.birthDate;

    if (dateString !== null && dateString !== undefined) {
      const fecha = new Date(dateString.toString());
      this.dateBirt = { year: fecha.getFullYear(), month: fecha.getMonth() + 1, day: fecha.getDate() }
    }

    this.formGroupEditUser();
    this.visibleModalEdit = true;
  }

  closeDialogEdit() {
    this.visibleModalEdit = false;
  }


  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
