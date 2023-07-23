import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

import * as fromApp from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store';
import * as AuthActions from "src/app/auth/store/auth.actions";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private loggingService: LoggingService, private store: Store<fromApp.AppState>) { }
  ngOnInit(): void {
    //  this.authService.autoLogin();


    this.store.dispatch(new AuthActions.AutoLogin())
    //  this.loggingService.printLog('Hello from App component')
  }
  // title = 'recipe-book-app';

  // loadedFeature='recipe';
  // onNavigate(feature:string){
  //   this.loadedFeature=feature
  // }

}
