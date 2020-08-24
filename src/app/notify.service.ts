import { Injectable } from '@angular/core';
import { Notify } from './models/notify';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  msgs:Notify[]=[];

  add(msg:Notify){
    this.msgs.push(msg);
  }

  clear(){
    this.msgs=[];
  }

  getMsgs():Observable<Notify[]>{
    return of(this.msgs);
  }

  constructor() { }
}
