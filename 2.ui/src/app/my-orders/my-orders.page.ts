import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
  orders = [];

  constructor(private router: Router, private data: DataService) { } // constructor

  ngOnInit() { }// ngOnInit

  ionViewDidEnter() {
    this.data.getOrders().then((orders: Array<any>) => {
      this.orders = orders;
    }).catch((err) => {
      console.log(err);
    });
  } // ionViewDidEnter

}
