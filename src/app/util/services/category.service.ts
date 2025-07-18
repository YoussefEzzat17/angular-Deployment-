import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  getAllCategories(): Observable<any> {
    return this.http.get(`https://electronics-ecommerce-node-doej.vercel.app/api/categories`);
  }
  getSpecificCategory(name: string | null): Observable<any> {
    return this.http.get(`https://electronics-ecommerce-node-doej.vercel.app/api/categories/${name}`);
  }
}
