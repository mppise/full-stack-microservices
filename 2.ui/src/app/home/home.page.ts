import { Component } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from "@angular/router";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  version = "v1.1.0";
  products;
  temporaryCart = [];

  constructor(private router: Router, private data: DataService) { } // constructor

  ngOnInit() { } // ngOnInit

  ionViewWillEnter() {
    if (localStorage.getItem('cart'))
      this.temporaryCart = JSON.parse(localStorage.getItem('cart'));
    else
      this.temporaryCart = [];
  } // ionViewWillEnter

  ionViewDidEnter() {
    this.data.getProducts().then((products) => {
      this.products = products;
    }).catch((err) => {
      console.log(err);
    });
  } // ionViewDidEnter

  resetData() {
    this.data.loadProducts().catch((err) => console.log(err));
    this.data.emptyOrders().catch((err) => console.log(err));
    alert("Reset triggered! Please reload the page");
  } // resetData

  addToCart(product, i) {
    let duplicate = false;
    this.temporaryCart.forEach((item) => {
      if (item.product_id == product.product_id)
        duplicate = true;
    });
    if (!duplicate) {
      this.products[i].inCart = true;
      this.temporaryCart.push(product);
      localStorage.setItem('cart', JSON.stringify(this.temporaryCart));
    }
    else {
      alert(product.name + " has already been added to the cart.");
    }
  } // addToCart

} // HomePage
