import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userToken='))
    ?.split('=')[1];

  headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  getAllProducts(): Observable<any> {
    return this.http.get(`http://localhost:4000/api/products`);
  }
  getSpecificProduct(id: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/product/${id}`, {
      headers: this.headers,
    });
  }
  getAllComments(id: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/product/comment/${id}`, {
      headers: this.headers,
    });
  }
  addComment(id: string, comment: any): Observable<any> {
    return this.http.post(
      `http://localhost:4000/api/product/comment/${id}`,
      comment,
      {
        headers: this.headers,
      }
    );
  }

  deleteComment(productId: string, commentId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:4000/api/product/comment/${productId}/${commentId}`,
      {
        headers: this.headers,
      }
    );
  }
  editComment(
    productId: string,
    commentId: string,
    comment: string
  ): Observable<any> {
    return this.http.patch(
      `http://localhost:4000/api/product/comment/${productId}/${commentId}`,
      { comment },
      {
        headers: this.headers,
      }
    );
  }

 
}
