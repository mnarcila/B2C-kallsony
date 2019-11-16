import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductosInner, ProductoService, ProductoRsType } from "../../../_restProducto";
@Component({
	selector: 'app-cart-calculator',
	templateUrl: './cart-calculator.component.html',
	styleUrls: [ './cart-calculator.component.scss' ]
})
export class CartCalculatorComponent implements OnInit, OnChanges {
	@Input() products: ProductosInner[];

	totalValue = 0;
	constructor() {}

	ngOnChanges(changes: SimpleChanges) {
		const dataChanges: SimpleChange = changes.products;

		const products: ProductosInner[] = dataChanges.currentValue;
		this.totalValue = 0;
		products.forEach((product) => {
			this.totalValue += product.valorBase;
		});
	}

	ngOnInit() {}
}
