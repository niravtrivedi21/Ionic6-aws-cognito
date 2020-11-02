import { Component, OnInit } from '@angular/core';
import { SignUpPage } from '../sign-up/sign-up.page';
import { CognitoService } from '../services/cognito-service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  constructor(public cognitoSerive: CognitoService, public router: Router, public alertController: AlertController) {
  }
  ngOnInit() {
  }

  login() {
    this.cognitoSerive.authenticate(this.email, this.password)
      .then((res: any) => {
        console.log(res);
        this.router.navigate(['home'])
      }, async (err) => {
        if (err.code == "UserNotConfirmedException") {
          this.promptVerificationCode();
        } else if (err.code == "NotAuthorizedException") {
          let alert = await this.alertController.create({
            header: 'Error',
            message: err.message,
            buttons: ['OK']
          });

          await alert.present();
        }
        console.log(err);
      });
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
    this.cognitoSerive.confirmUser(verificationCode, this.email).then(
      (res) => {
        this.login();
      },
      err => {
        alert(err.message);
      }
    );
  }

  signUp() {
    this.router.navigate(['sign-up'])
  }


}
