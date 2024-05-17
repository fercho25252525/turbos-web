// Angular Import
import { Component, EventEmitter, NgIterable, Output } from '@angular/core';
import { Pqrs } from 'src/app/models/pqrs';
import { User } from 'src/app/models/user';
import { PqrsService } from 'src/app/services/pqrs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent {
  pqr: Pqrs = new Pqrs

  @Output() ChatCollapse = new EventEmitter();
  @Output() ChatToggle = new EventEmitter();
  friendsList: NgIterable<any> | null | undefined;
  pqrs: Pqrs[] = [];
  role: string | null = null;
  username: string | null = null;

  constructor(private pqrsService: PqrsService,
    private userService: UserService) {
    this.getPqrs()
    this.getSesion()
    // this.friendsList = FriendsList.friends;
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

  getPhotoUser(userName: string): void {
    console.log(userName);
    
    this.userService.getImage(userName)
      .subscribe(
        imagen => {
          const user = this.pqrs.find(u => u.user.userName === userName && !(u.user.photo?.startsWith('blob')) );          
          if (user) {
            user.user.photo = URL.createObjectURL(imagen);
          }
        });
  }

  getPqrs() {
    this.pqrsService.getPqrs()
      .subscribe({
        next: data => {
          this.pqrs = data.data;
          console.log(this.pqrs);
          
          this.pqrs.forEach(user => {
            
            this.getPhotoUser(user.user.userName);
          });
        },
        error: error => {
        },
        complete: () => {
          

          this.friendsList = this.pqrs
          console.log(this.pqrs);
        }
      });

      
      
  }

  ChatOn() {
    this.ChatToggle.emit();
  }
}
