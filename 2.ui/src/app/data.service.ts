import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { } // constructor

  loadProducts() {
    return this.http.post('http://localhost/api/product/prepare', {}).toPromise();
  } // loadProducts

  emptyOrders() {
    return this.http.post('http://localhost/api/order/prepare', {}).toPromise();
  } // emptyOrders

  getProducts() {
    return this.http.get('http://localhost/api/product').toPromise();
  } // getProducts

  getOrders() {
    return this.http.get('http://localhost/api/order').toPromise();
  } // getOrders

  submitOrder(order) {
    return this.http.post('http://localhost/api/order', order).toPromise();
  } // submitOrder

} // DataService
