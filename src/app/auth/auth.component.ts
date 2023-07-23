import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
 import * as fromApp from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store';
import * as AuthActions from "src/app/auth/store/auth.actions";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost:PlaceholderDirective;
  private closeSub:Subscription;
  private storeSub:Subscription;

   

  constructor(private authService: AuthService, private router: Router,private componentFactoryResolver:ComponentFactoryResolver,private store:Store<fromApp.AppState>) { }
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  
  onSubmit(form: NgForm) {
    
    if (!form.valid)
    return
    
    const email = form.value.email;
    const password = form.value.password;

  //  this.isLoading = true;
    this.error = null;

  //  let authObs: Observable<AuthResponseData>
    
    if (this.isLoginMode) {

     // authObs = this.authService.login(email, password);
     this.store.dispatch(new AuthActions.LoginStart({email:email,password:password}));

    } else {
     // authObs = this.authService.signup(email, password);
     this.store.dispatch(new AuthActions.SignupStart({email:email,password:password}));
    }

   
    


    // authObs.subscribe(response => {
    //   console.log(response)
    //   this.isLoading = false;
    //   this.router.navigate(['/recipes'])
    // }, errorRes => {
    //   this.isLoading = false;
    //   this.error = errorRes
    //   this.showErrorAlert(errorRes);
    //   console.log(errorRes);
    // })
    
    form.reset();
  }
  
  onHandleError() {
    //this.error = null;
    this.store.dispatch(new AuthActions.ClearError())
  }
  
  
  private showErrorAlert(message:string) {
    const alertCmpFactory= this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef=this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef=hostViewContainerRef.createComponent(alertCmpFactory); 
    componentRef.instance.message=message;
    this.closeSub= componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
    
    
  }

  
  ngOnInit(): void {
   this.storeSub= this.store.select('auth').subscribe((authState)=>{
      this.isLoading=authState.loading
      this.error=authState.authError
      if(this.error){
        this.showErrorAlert(this.error)
      }      
    })
  }
  
  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }
}
