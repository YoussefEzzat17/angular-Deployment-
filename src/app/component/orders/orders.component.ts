import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OrderService } from '../../util/services/order.service';
import { IOrder } from '../../util/interfaces/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders:IOrder[]=[];
  private readonly _OrderService=inject(OrderService)
  private readonly _Router=inject(Router)
    serverURL = 'http://localhost:4000/uploads/';

  ngOnInit(): void {
      this._OrderService.getOrders().subscribe({
        next:(res)=>{
          console.log(res)
          this.orders=res.orders;
        },
        error:(err)=>{
          console.log(err)
        }
      })
  }

  total():number{
    let total:number=0;
    if(this.orders.length>0 ){
      for(let i=0;i<this.orders.length;i++){
          total+=Number(this.orders[i].total)
      }
    }
    return total
  }
  deleteSpecificProduct(orderId:string | undefined){
    this._OrderService.deleteSpecificOrder(orderId).subscribe({
        next:(res)=>{
          console.log(res)
          this.orders=res.remainingOrders;
        },
        error:(err)=>{
          console.log(err)
        }
      })
  }
  deleteAllOrders(){
    this._OrderService.deleteAllOrders().subscribe({
        next:(res)=>{
          console.log(res)
          this.orders=[];
          this._Router.navigate(['/home'])
        },
        error:(err)=>{
          console.log(err)
        }
      })
  }
}
