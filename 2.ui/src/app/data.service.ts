import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { } // constructor

  loadProducts() {
    return this.http.post('https://productsapi.f976b46.kyma.ondemand.com/prepare', {}).toPromise();
  } // loadProducts

  emptyOrders() {
    return this.http.post('https://ordersapi.f976b46.kyma.ondemand.com/prepare', {}).toPromise();
  } // emptyOrders

  getProducts() {
    return this.http.get('https://productsapi.f976b46.kyma.ondemand.com').toPromise();
  } // getProducts

  getOrders() {
    return this.http.get('https://ordersapi.f976b46.kyma.ondemand.com').toPromise();
  } // getOrders

  submitOrder(order) {
    return this.http.post('https://ordersapi.f976b46.kyma.ondemand.com', order).toPromise();
  } // submitOrder

} // DataService
