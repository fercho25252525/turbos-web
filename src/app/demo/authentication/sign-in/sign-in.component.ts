import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {

  formLogin!: FormGroup;
  titleLogin: String = 'Iniciar sesión'
  user!: User
  errorCredential!: boolean

  constructor(private authService: AuthService, private router: Router) {
    this.user = new User();
  }

  ngOnInit(){
    this.isAuthenticate()
    this.form()    
  }

  form(){
    this.formLogin = new FormGroup({
      userForm: new FormControl('', [Validators.required]),
      passwordForm: new FormControl('', [Validators.required])
    });
  }

  isAuthenticate(){
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/analytics'])
    }
  }

  login(): void {
    console.log(this.user);
    this.authService.login(this.user).subscribe(response =>{
      let payload = JSON.parse(atob(response.access_token.split('.')[1]))
      console.log(payload);
      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);
      let user = this.authService.user;
      console.log("Bienvenido " + user!.name);     
      
      this.router.navigate(['/analytics'])
    }, err => {
      if(err.status == 400){
        this.errorCredential = true
        console.log("Error de credenciales");
        (async () => {
          await this.delay(4000)
          this.errorCredential = false
        })()
      }
    })
  }

  get userAndPasswordRequired() {
    return (this.formLogin.get('userForm')!.hasError('required') && this.formLogin.get('userForm')!.touched) ||
           (this.formLogin.get('passwordForm')!.hasError('required') && this.formLogin.get('passwordForm')!.touched)
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
