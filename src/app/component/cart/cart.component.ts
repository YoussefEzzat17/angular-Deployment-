import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../util/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  products: any[] = [];
  totalCheckout: number = 0;
  couponCode: string = '';
  couponApplied: boolean = false;
  couponMessage: string = '';
  discountAmount: number = 0;
  isLoading: boolean = true;

  cartCount: number = 0; 
  private subscriptions = new Subscription();

  serverURL = 'http://localhost:4000/uploads/';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();

    this.subscriptions.add(
      this.cartService.cartCount$.subscribe((count) => {
        this.cartCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateLocalStorage() {
    localStorage.setItem('productCart', JSON.stringify(this.products));
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.products = response.cart.products;
          this.calcCheckout();
          this.updateLocalStorage();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to load cart:', error);
        this.isLoading = false;
      }
    );
  }

  increaseQuantity(productId: string) {
    const item = this.products.find((p) => p.productId._id === productId);
    if (item) {
      item.quantity++;
      this.updateQuantityInCart(productId, item.quantity);
    }
  }

  decreaseQuantity(productId: string) {
    const item = this.products.find((p) => p.productId._id === productId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.updateQuantityInCart(productId, item.quantity);
    }
  }

  updateQuantityInCart(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.loadCart();
        }
      },
      (error) => {
        console.error('Failed to update quantity:', error);
      }
    );
  }

  deleteProduct(productId: string) {
    this.cartService.removeProduct(productId).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.loadCart();
        }
      },
      (error) => {
        console.error('Failed to remove product:', error);
      }
    );
  }

  calcCheckout() {
    this.totalCheckout = this.products.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0);
  }

  clearCart() {
    this.cartService.clearCart().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.products = [];
          this.totalCheckout = 0;
          this.updateLocalStorage();
        }
      },
      (error) => {
        console.error('Failed to clear cart:', error);
      }
    );
  }

  handelcoupon() {
    if (!this.couponCode) {
      this.couponMessage = 'Please enter a coupon code.';
      this.couponApplied = false;
      return;
    }

    this.cartService.applyCoupon(this.couponCode).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.totalCheckout = response.newTotal;
          this.discountAmount = response.discount || 0;
          this.couponApplied = true;
          this.couponMessage =
            response.message || 'Coupon applied successfully!';
        } else {
          this.couponApplied = false;
          this.couponMessage = response.message || 'Invalid coupon.';
        }
      },
      (error) => {
        console.error('Failed to apply coupon:', error);
        this.couponApplied = false;
        this.couponMessage = 'Invalid coupon code. Please try again';
      }
    );
  }
}
