import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getToken() {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('userToken='))
          ?.split('=')[1]
      }`
    );
  }

  getAllAdminProducts(): Observable<any> {
    return this.http.get(`http://localhost:4000/api/dashboard`, {
      headers: this.getToken(),
    });
  }

  getproductById(id: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/product/${id}`, {
      headers: this.getToken(),
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`http://localhost:4000/api/product/${id}`, {
      headers: this.getToken(),
    });
  }

  addProduct(product: any): Observable<any> {
    product.append('sold', '0');

    return this.http.post(`http://localhost:4000/api/product`, product, {
      headers: this.getToken(),
    });
  }

  updateProduct(id: string, productFormData: FormData): Observable<any> {
    return this.http.patch(
      `http://localhost:4000/api/product/${id}`,
      productFormData,
      {
        headers: this.getToken(),
      }
    );
  }

  getAllAdminOrders(adminID: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/order/admin/${adminID}`, {
      headers: this.getToken(),
    });
  }
  completedOrder(orderID: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/ordercomplate/${orderID}`, {
      headers: this.getToken(),
    });
  }

  getAllAdminCustomers(adminID: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/customer/${adminID}`, {
      headers: this.getToken(),
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/user/${id}`, {
      headers: this.getToken(),
    });
  }

  addCategory(data: any): Observable<any> {
    return this.http.post(`http://localhost:4000/api/categories`, data, {
      headers: this.getToken(),
    });
  }
}
