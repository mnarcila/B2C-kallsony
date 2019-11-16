import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-checkout-navbar",
  templateUrl: "./checkout-navbar.component.html",
  styleUrls: ["./checkout-navbar.component.scss"]
})
export class CheckoutNavbarComponent implements OnInit {
  constructor() {}
	rutaImagen;
  ngOnInit() {

    this.rutaImagen = environment.rutaImagen;

  }
}
