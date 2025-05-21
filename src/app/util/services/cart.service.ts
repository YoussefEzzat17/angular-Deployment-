import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:4000/api/cart';

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getTokenHeaders(): { headers: HttpHeaders } {
    const token = this.getTokenFromCookie('userToken');
    console.log(token);
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  private getTokenFromCookie(name: string): string {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name + '=') === 0) {
        return c.substring(name.length + 1);
      }
    }
    return '';
  }

  addToCart(productId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/add`,
      { productId },
      this.getTokenHeaders()
    );
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl, this.getTokenHeaders()).pipe(
      tap(response => {
        if (response.status === 'success' && response.cart && response.cart.products) {
          this.updateCartCount(response.cart.products);
        }
      })
    );
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/update`,
      { productId, quantity },
      this.getTokenHeaders()
    );
  }

  removeProduct(productId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/remove/${productId}`,
      this.getTokenHeaders()
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clear`, this.getTokenHeaders());
  }

  applyCoupon(code: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/apply-coupon`,
      { code },
      this.getTokenHeaders()
    );
  }

private updateCartCount(products: any[]) {
  const totalQuantity = products.reduce((acc, item) => acc + (item.quantity || 0), 0);
  this.cartCountSubject.next(totalQuantity);
}

}
