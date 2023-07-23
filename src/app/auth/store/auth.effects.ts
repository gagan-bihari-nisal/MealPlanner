import { Actions, Effect, createEffect, ofType } from "@ngrx/effects";
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators'
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { of, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { error } from "@angular/compiler/src/util";
import { User } from "../user-model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (resData: AuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)

    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate)
    localStorage.setItem('userData', JSON.stringify(user))



    return new AuthActions.AuthenticateSuccess({ email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate, redirect: true });
}

const handleError = (errorRes: any) => {

    let errorMessage = 'An unknown error occured'
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email is already exists';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exists';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'Invalid Password';
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));

}

@Injectable()
export class AuthEffects {


    authSignup = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupAction: AuthActions.SignupStart) => {

                return this.http.post<AuthResponseData>(environment.signupUrl + environment.firebaseApiKey, {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }).pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                    }),
                    map(resData => {
                        this.authService.localId.next(resData.localId);
                        return handleAuthentication(resData);
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes)
                    }),
                )
            })
        )
    })


    authLogin$ = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(AuthActions.LOGIN_START),
                switchMap((authData: AuthActions.LoginStart) => {

                    return this.http.post<AuthResponseData>(environment.loginUrl + environment.firebaseApiKey, {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }).pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                        }),
                        map(resData => {
                            this.authService.localId.next(resData.localId);
                            return handleAuthentication(resData)
                        }),
                        catchError(errorRes => {
                            return handleError(errorRes)
                        }),
                    );
                }),

            )
    })







    authRedirect = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.AUTHENTICATE_SUCCESS),
                tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
                    if (authSuccessAction.payload.redirect) {
                        this.router.navigate(['/']);
                    }
                })
            ),
        { dispatch: false }
    );


    autoLogin = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AuthActions.AUTO_LOGIN),
                map(() => {
                    const userData: {
                        email: string,
                        id: string,
                        _token: string,
                        _tokenExpirationDate: string
                    } = JSON.parse(localStorage.getItem('userData'))
                    if (!userData) {
                        return { type: 'DUMMY' }
                    }
                    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

                    if (loadedUser.token) {
                        // this.user.next(loadedUser);
                        //    this.store.dispatch(new AuthActions.AuthenticateSuccess({email:loadedUser.email,userId:loadedUser.id,token:loadedUser.token,expirationDate:new Date(userData._tokenExpirationDate)}))
                        const expirationDuration =
                            new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                        this.authService.setLogoutTimer(expirationDuration);

                        return new AuthActions.AuthenticateSuccess({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate), redirect: false })


                        // this.autoLogout(
                        //   new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                        // );
                    }
                    return { type: 'DUMMY' }
                })

            )
        })
    authLogout = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.LOGOUT),
                tap(() => {
                    this.authService.clearLogoutTimer();
                    localStorage.removeItem('userData')
                    this.router.navigate(['/auth'])
                })
            ), {
        dispatch: false
    }
    )

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}