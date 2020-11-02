import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../services/cognito-service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  email: string;
  password: string;

  constructor(
    public CognitoService: CognitoService,
    public alertController: AlertController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  signUp() {
    this.CognitoService.signUp(this.email, this.password).then(
      res => {
        console.log(res);
        this.promptVerificationCode();
      },
      err => {
        console.log(err);
      }
    );
  }

  async promptVerificationCode() {
    let alert = await this.alertController.create({

      header: "Enter Verfication Code",
      inputs: [
        {
          name: "VerificationCode",
          placeholder: "Verification Code"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Verify",
          handler: data => {
            this.verifyUser(data.VerificationCode);
          }
        }
      ]
    });
    await alert.present();
  }

  verifyUser(verificationCode) {
    this.CognitoService.confirmUser(verificationCode, this.email).then(
      res => {
        console.log(res);
        this.router.navigate(['login'])
      },
      err => {
        alert(err.message);
      }
    );
  }

}
