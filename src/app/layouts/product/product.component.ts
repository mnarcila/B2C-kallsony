import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"]
})
export class ProductComponent implements OnInit {
  constructor(
    public sanitizer: DomSanitizer

  ) { }
  rutaImagen;


  ngOnInit(


  ) {
    this.rutaImagen = environment.rutaImagen;
   
  }

  getRutaImagen(): string {
    return this.rutaImagen;
  }
}
