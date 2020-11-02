import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";


@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  _POOL_DATA = {
    UserPoolId: "<<  Your User Pool Id >>",
    ClientId: "<< Your Clinet Id >>"
  };

  constructor() { }


  signUp(email, password) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      let userAttribute = [];
      userAttribute.push(
        new AWSCognito.CognitoUserAttribute({ Name: "email", Value: email })
      );

      userPool.signUp(email, password, userAttribute, null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  logOut(email) {
    return new Promise((resolved, reject) => {

      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
      var userData = {
        Username: email,
        Pool: userPool,
      };

      const cognitoUser = new AWSCognito.CognitoUser(userData);

      cognitoUser.signOut();
      resolved(true);

    });
  }


  confirmUser(verificationCode, userName) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userName,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  authenticate(email, password) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      const authDetails = new AWSCognito.AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          resolved(result);
        },
        onFailure: err => {
          reject(err);
        },
        newPasswordRequired: userAttributes => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // the api doesn't accept this field back
          userAttributes.email = email;
          delete userAttributes.email_verified;

          cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
            onSuccess: function (result) { },
            onFailure: function (error) {
              reject(error);
            }
          });
        }
      });
    });
  }

  currentUser() {
    const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
      console.log("current", userPool.getCurrentUser())
      userPool.getCurrentUser();
      return userPool.getCurrentUser().getUsername();
  }

  checkTokenIsValide() {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
      console.log("current", userPool.getCurrentUser())
      userPool.getCurrentUser();
      if (userPool.getCurrentUser() !== null) {
        userPool.getCurrentUser().getSession((err, session) => {
          if (err) {
            reject(false);
          } else {
            resolved(true)
          }
          console.log('session validity: ' + session.isValid());
        })
      }
    });
  }

}
