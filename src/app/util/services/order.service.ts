import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../interfaces/order';
import { environment } from '../environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _HttpClient=inject(HttpClient);
  constructor() { }

  createOrder(body:IOrder):Observable<any>{
    let token=document.cookie.split("=")[1];
    const user:{userID:string}=jwtDecode(token);
    return this._HttpClient.post(`${environment.baseUrl}/api/order`,{...body,userId:user.userID},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
  }
  getOrders():Observable<any>{
    let token=document.cookie.split("=")[1];
    const user:{userID:string}=jwtDecode(token);
    return this._HttpClient.get(`${environment.baseUrl}/api/order/${user.userID}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
  }
  deleteAllOrders():Observable<any>{
    let token=document.cookie.split("=")[1];
    console.log(token)
    const user:{userID:string}=jwtDecode(token);
    return this._HttpClient.delete(`${environment.baseUrl}/api/orders/delete/${user.userID}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
  }
  deleteSpecificOrder(orderId:string | undefined):Observable<any>{
    let token=document.cookie.split("=")[1];
    console.log(token)
    return this._HttpClient.delete(`${environment.baseUrl}/api/order/delete/${orderId}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

  }

}
