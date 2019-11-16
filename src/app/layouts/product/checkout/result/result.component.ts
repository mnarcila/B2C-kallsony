import { Product } from '../../../../shared/models/product';
import { ProductService } from '../../../../shared/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ProductosInner } from 'src/app/_restProducto';
declare var $: any;
@Component({
	selector: 'app-result',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
	products: ProductosInner[];
	date: number;
	totalPrice = 0;
	idOrden: string;
	constructor(private productService: ProductService) {
		document.getElementById('resultTab').style.display = 'block';
		this.idOrden = productService.getIdOrden();
		this.products = productService.getLocalCartProducts();
		this.totalPrice = productService.getTotalPrice();
		this.date = Date.now();
		//una vez cargado los elementos se debe limpiar toda la información de memoria 
		this.products.forEach(element => {
			productService.removeLocalCartProduct(element)
		});
		this.productService.limpiarCampos();
	}

	ngOnInit() { }

	downloadReceipt() {
		const data = document.getElementById('receipt');
		html2canvas(data).then((canvas) => {
			// Few necessary setting options
			const imgWidth = 208;
			const pageHeight = 295;
			const imgHeight = canvas.height * imgWidth / canvas.width;
			const heightLeft = imgHeight;

			const contentDataURL = canvas.toDataURL('image/png');
			const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
			const position = 0;
			pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
			pdf.save(this.idOrden + '.pdf'); // Generated PDF
		});
	}
}
