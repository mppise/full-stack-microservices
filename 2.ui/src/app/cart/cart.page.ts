import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  temporaryCart = [];
  total = 0;
  orderConfirmation;

  constructor(private router: Router, private data: DataService) { } // constructor

  ngOnInit() { }// ngOnInit

  ionViewWillEnter() {
    if (localStorage.getItem('cart'))
      this.temporaryCart = JSON.parse(localStorage.getItem('cart'));
    else {
      this.temporaryCart = [];
      this.router.navigate(['home']);
    }
  } // ionViewWillEnter

  ionViewDidEnter() {
    this.temporaryCart.forEach((item) => {
      this.total += item.price;
    });
  } // ionViewDidEnter

  checkout() {
    let order = {
      items: this.temporaryCart,
      total: this.total
    };
    this.data.submitOrder(order)
      .then((resp) => {
        this.orderConfirmation = resp;
        localStorage.removeItem('cart');
      }).catch((err) => {
        console.log(err);
      });
  } // checkout

}
