import { AuthService } from './../../util/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Import Router for navigation
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../util/services/order.service';
import { Iproduct } from '../../util/interfaces/iproduct';


@Component({
  selector: 'app-checkout',
imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
  ],  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private readonly _OrderService=inject(OrderService)
  private  router = inject(Router);

  OrderForm:FormGroup=new FormGroup({
    details:new FormControl(null),
    phone:new FormControl(null,[Validators.required,Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]),
    address:new FormControl(null,[Validators.required,Validators.minLength(3)])
  })
  onSubmit(){
    let products:Iproduct[]=JSON.parse(localStorage.getItem("productCart") as string);
    console.log(products)
    if(this.OrderForm.valid){
      console.log(this.OrderForm)
      this._OrderService.createOrder({'order_details':this.OrderForm.value,products}).subscribe({
        next:(res)=>{
          console.log(res);
          this.router.navigate(['/orders'])
        },
        error:(err)=>{
          console.log(err)
        }
      })
    }

  }
}
