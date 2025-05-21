import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IFeedback } from '../interfaces/feedback';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly _HttpClient=inject(HttpClient)
  constructor() { }

  sendFeedback(body:IFeedback):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/feedback`,body)
  }

}
