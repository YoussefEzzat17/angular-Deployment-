import { Component, inject, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../util/services/auth.service';
import { CartService } from '../../util/services/cart.service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../util/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../util/services/wishlist.service';

@Component({
  selector: 'app-blank-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './blank-navbar.component.html',
  styleUrls: ['./blank-navbar.component.css'],
})
export class BlankNavbarComponent implements OnInit, OnDestroy {
  _AuthService = inject(AuthService);
  cartService = inject(CartService);
  WishlistService = inject(WishlistService);

  isAdmin: boolean = false;
  cartCount: number = 0;
  wishListCounter: number = 0;

  private subscriptions = new Subscription();

  token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userToken='))
    ?.split('=')[1];

  ngOnInit(): void {
    const user = jwtDecode<DecodedToken>(this.token as string);
    this.isAdmin = user.role === 'admin';

    this.subscriptions.add(
      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
      })
    );
    this.subscriptions.add(
      this.WishlistService.wishlistCount$.subscribe(count => {
        this.wishListCounter = count;
      })
    );
    this.cartService.getCart().subscribe({
      next:(res)=>{
        // this.cartService.updateCartCount(res.cart.products.length);
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
