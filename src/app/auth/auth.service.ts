import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user-model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer'
import * as AuthActions from 'src/app/auth/store/auth.actions'
import * as RecipesActions from '../recipes/store/recipes.actions'

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // user = new BehaviorSubject<User>(null);
  localId = new BehaviorSubject<string>(null);
  token: string = null;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

  // signup(email: string, password: string) {
  //   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseApiKey, {
  //     email: email,
  //     password: password,
  //     returnSecureToken: true
  //   })
  //   .pipe(catchError(this.handleError), tap(resData => {
  //     this.handleAuthentication(email, resData.localId, resData.idToken, +resData.expiresIn)
  //   }))
  // }

  // login(email: string, password: string) {
  //   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebaseApiKey, {
  //     email: email,
  //     password: password,
  //     returnSecureToken: true
  //   })
  //   .pipe(catchError(this.handleError), tap(resData => {
  //     this.handleAuthentication(email, resData.localId, resData.idToken, +resData.expiresIn)

  //   }))
  // }




  // autoLogin() {
  //   const userData: {
  //     email: string,
  //     id: string,
  //     _token: string,
  //     _tokenExpirationDate: string
  //   } = JSON.parse(localStorage.getItem('userData'))
  //   if (!userData) {
  //     return;
  //   }
  //   const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

  //   if (loadedUser.token) {
  //    // this.user.next(loadedUser);
  //    this.store.dispatch(new AuthActions.AuthenticateSuccess({email:loadedUser.email,userId:loadedUser.id,token:loadedUser.token,expirationDate:new Date(userData._tokenExpirationDate)}))
  //     this.autoLogout(
  //       new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
  //     );
  //   }
  // }




  // logout() {
  // //  this.user.next(null);
  // this.store.dispatch(new AuthActions.Logout())
  //   this.router.navigate(['/auth'])
  //   localStorage.removeItem('userData')
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer)
  //   }
  //   this.tokenExpirationTimer = null;
  // }



  // autoLogout(expirationDuration: number) {
  //   this.tokenExpirationTimer = setTimeout(() => {
  //     this.logout();
  //   }, expirationDuration)
  // }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout())
    }, expirationDuration)
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
      this.tokenExpirationTimer = null
      this.store.dispatch(new RecipesActions.SetRecipes([]))
    }
  }


  // private handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
  //   const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000)
  //   const user = new User(email, id, token, expirationDate)
  //  // this.user.next(user);
  //  this.store.dispatch(new AuthActions.AuthenticateSuccess({email:email,userId:id,token:token,expirationDate:expirationDate}))
  //   this.autoLogout(expiresIn * 1000)
  //   localStorage.setItem('userData', JSON.stringify(user))
  // }

  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occured'
  //   if (!errorRes.error || !errorRes.error.error) {
  //     return throwError(errorMessage)
  //   }
  //   switch (errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'This email is already exists';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'This email does not exists';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'Invalid Password';
  //       break;
  //   }
  //   return throwError(errorMessage)
  // }
}
