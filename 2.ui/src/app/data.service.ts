import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { } // constructor

  loadProducts() {
    return this.http.post('https://productsapi.d5c6411.kyma.ondemand.com/prepare', {}).toPromise();
  } // loadProducts

  emptyOrders() {
    return this.http.post('https://ordersapi.d5c6411.kyma.ondemand.com/prepare', {}).toPromise();
  } // emptyOrders

  getProducts() {
    return this.http.get('https://productsapi.d5c6411.kyma.ondemand.com').toPromise();
  } // getProducts

  getOrders() {
    return this.http.get('https://ordersapi.d5c6411.kyma.ondemand.com').toPromise();
  } // getOrders

  submitOrder(order) {
    return this.http.post('https://ordersapi.d5c6411.kyma.ondemand.com', order).toPromise();
  } // submitOrder

} // DataService
