import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  lastLog:string
  constructor() { }

  printLog(message:string){
   
    this.lastLog=message;
  }
}
