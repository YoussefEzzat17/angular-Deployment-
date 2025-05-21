import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Iproduct } from '../interfaces/iproduct';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);

  private token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userToken='))
    ?.split('=')[1];

  private headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.token}`
  );
  API_URL = `${environment?.baseUrl}/api/wishlist`;
  loadWishlist() {
    return this.http.get<{ wishlist: Iproduct[] }>(this.API_URL, {
      headers: this.headers,
    });
  }

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/${productId}`,
      {},
      {
        headers: this.headers,
      }
    );
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${productId}`, {
      headers: this.headers,
    });
  }

  // isInWishlist(id: string): boolean {
  //   return this.wishlistSubject.value.some((item) => item.id === id);
  // }
}
