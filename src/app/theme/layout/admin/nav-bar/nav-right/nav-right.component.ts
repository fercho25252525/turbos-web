// Angular Import
import { Component, DoCheck } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements DoCheck {
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  gradientConfig = GradientConfig;
  signIn!: boolean
  role: string | null = null;
  username: string | null = null;
  name: string | null = null;
  photo: string | null = null;
  gender: string | null = null;

  defaultImgMen: string = '../../../../../../../../assets/images/user/predeterminadoHombre.png';
  defaultImgWoman: string = '../../../../../../../../assets/images/user/predeterminadoMujer.png';
  defaultImgIndefined: string = '../../../../../../../../assets/images/user/predeterminadoIndefinido.png';

  // constructor
  constructor(public authService: AuthService, private router: Router,
    private userService: UserService
  ) {
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  ngDoCheck() {
    if (document.querySelector('body')?.classList.contains('elite-rtl')) {
      this.gradientConfig.isRtlLayout = true;
    } else {
      this.gradientConfig.isRtlLayout = false;
    }
  }

  ngOnInit() {
    console.log("ingresa sesion");

    this.signIn = this.authService.isAuthenticated() ? false : true
    if(this.signIn){
      this.router.navigate(['/auth/signin'])
    }
    this.getSesion()
    this.getPhotoUser()
  }


  getSesion() {
    const roleSeion = this.getFromSessionStorage('user');
    const rol = JSON.parse(roleSeion!);
    console.log(rol);

    this.username = rol.userName
    this.name = rol.name + " " + rol.lastName
    this.photo = rol.photo
    this.gender = rol.gender
    this.role = rol.roles[0]
  }


  getFromSessionStorage(key: string): string | null {
    const value = sessionStorage.getItem(key);
    return value;
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/auth/signin'])
  }

  getImgUser(): string {
    if (this.gender === 'Hombre') {
      return this.photo || this.defaultImgMen;
    } else if (this.gender === 'Mujer') {
      return this.photo || this.defaultImgWoman;
    } else {
      return this.photo || this.defaultImgIndefined;
    }
  }

  getPhotoUser(): void {

    this.userService.getImage(this.username!)
      .subscribe(
        imagen => {
          // const user = this.pqrs.find(u => u.user.userName === userName && !(u.user.photo?.startsWith('blob')) );          
          // if (user) {
          this.photo = URL.createObjectURL(imagen);
          // }
        });
  }
}
