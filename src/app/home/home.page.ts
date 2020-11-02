import { Component } from '@angular/core';
import { CognitoService } from '../services/cognito-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public cognitoSerive:CognitoService, public router: Router) {}


  async logout() {
    let userData = await this.cognitoSerive.currentUser();
    console.log('userData', userData)
    this.cognitoSerive.logOut(userData)
    .then((res) =>{
      console.log(res);
      localStorage.clear();
      this.router.navigate(['login'])
    }, err =>{
      console.log(err);
    });
  }
}
