import { Role } from 'src/app/models/user';
// Angular Import
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { MessageService } from 'primeng/api';
import { Pqrs, PqrsAdd } from 'src/app/models/pqrs';
import { User } from 'src/app/models/user';
import { PqrsService } from 'src/app/services/pqrs.service';
import { UserService } from 'src/app/services/user.service';

// interface friendsList {
//   id: number;
//   photo: string;
//   name: string;
//   new: number;
//   status: number;
//   time: string;
// }

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  // @Input() friends!: friendsList;
  @Input() friends!: Pqrs;
  @Input() friendId!: Pqrs;
  @Output() ChatOn = new EventEmitter();
  @Output() ChatCollapse = new EventEmitter();

  defaultImgMen: string = '../../../../../../../../assets/images/user/predeterminadoHombre.png';
  defaultImgWoman: string = '../../../../../../../../assets/images/user/predeterminadoMujer.png';
  defaultImgIndefined: string = '../../../../../../../../assets/images/user/predeterminadoIndefinido.png';
  flagDescriptionPqrs = false;
  flagResponsePqrs = false;
  responseValue!: string
  addPqrs!: PqrsAdd
  formAddPqrs!: FormGroup;
  role: string | null = null;
  username: string | null = null;

  constructor(private pqrsService: PqrsService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private userService: UserService) {
    // this.getPqrs()
    // this.friendsList = FriendsList.friends;
  }

  ngOnInit() {
    this.formGroupAddPqrs()
    this.getSesion()

  }

  getSesion(){
    const roleSeion = this.getFromSessionStorage('user');
    const rol = JSON.parse(roleSeion!);    
    this.username = rol.userName
    this.role = rol.roles[0]    
  }


  getFromSessionStorage(key: string): string | null {
    const value = sessionStorage.getItem(key);
    return value;
  }

  formGroupAddPqrs() {
    this.formAddPqrs = this.fb.group({
      typePqrs: ['', Validators.required],
      prioriry: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ceatePqrs() {
    console.log('entra create');

    this.addPqrs = {
      typePqrs: this.formAddPqrs.get('typePqrs')?.value,
      priority: this.formAddPqrs.get('prioriry')?.value,
      description: this.formAddPqrs.get('description')?.value,
      user: { userName: this.username! },
    }

    console.log(this.addPqrs);

    this.pqrsService.createPqrs(this.addPqrs).subscribe(
      {
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `${data.message}`, });
        },
        complete: () => {
          this.formAddPqrs.reset()
          this.ChatCollapse.emit()
          // this.ChatOn.emit()
        }
      }
    )
  }

  public innerChatToggle() {
    this.flagDescriptionPqrs = true
    if (this.friendId.status === 'Creado') {
      this.friendId.status = 'Leido'
      this.pqrsService.updatePqrs(this.friendId).subscribe(
        {
          next: data => {
            // this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `Se ha actualizado el PQRS ${this.friends.idPqrs}`, });
          },
        }
      )
    }
  }

  responsePqrs() {
    this.flagDescriptionPqrs = true
    if (this.friendId.status === 'Creado') {
      this.friendId.status = 'Leido'
      this.pqrsService.updatePqrs(this.friendId).subscribe(
        {
          next: data => {
            // this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `Se ha actualizado el PQRS ${this.friends.idPqrs}`, });
          },
        }
      )
    }
  }

  appendPqrs() {
    this.flagResponsePqrs = true

  }

  sendResponse() {
    this.friendId.response = this.responseValue;
    this.friendId.status = 'Respondido'
    this.friendId.view = 0
    this.flagResponsePqrs = false
    this.flagDescriptionPqrs = false;
    this.pqrsService.updatePqrs(this.friendId).subscribe(
      {
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Confirmación', detail: `Se ha actualizado el PQRS ${this.friends.idPqrs}`, });
        },
        error: error => {

        },
        complete: () => {

        }
      }
    )
    this.responseValue = ''
  }

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
}
