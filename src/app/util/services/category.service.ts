import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  getAllCategories(): Observable<any> {
    console.log(this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/categories`));
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/categories`);
  }
  getSpecificCategory(name: string | null): Observable<any> {
    return this.http.get(`https://ecommerceapi-production-8d5f.up.railway.app/api/categories/${name}`);
  }
}
