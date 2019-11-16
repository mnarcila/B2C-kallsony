import { ProductService } from '../../../../shared/services/product.service';
import { Product } from '../../../../shared/models/product';
import { BillingService } from '../../../../shared/services/billing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User, UserDetail } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProductosInner } from 'src/app/_restProducto';
import { Cliente } from 'src/app/_restClientes';

@Component({
	selector: 'app-billing-details',
	templateUrl: './billing-details.component.html',
	styleUrls: [ './billing-details.component.scss' ]
})
export class BillingDetailsComponent implements OnInit {
	userDetails: Cliente;
	products: ProductosInner[];
	userDetail: UserDetail;
	idOrden: string
	constructor(
		
		authService: AuthService,
		private billingService: BillingService,
		productService: ProductService,
		private router: Router
	) {
		/* Hiding Shipping Tab Element */
		document.getElementById('productsTab').style.display = 'none';
		document.getElementById('shippingTab').style.display = 'none';
		document.getElementById('billingTab').style.display = 'block';
		document.getElementById('resultTab').style.display = 'none';
		this.idOrden = productService.getIdOrden();
		this.userDetail = new UserDetail();
		this.products = productService.getLocalCartProducts();
		this.userDetails = authService.getUsers();
	}

	ngOnInit() {}

	updateUserDetails(form: NgForm) {
		const data = form.value;

		data['emailId'] = this.userDetails.email;
		data['userId'] = this.userDetails.idCliente;
		let totalPrice = 0;
		const products = [];
		this.products.forEach((product) => {
			delete product['$key'];
			totalPrice += product.valorBase;
			products.push(product);
		});

		data['products'] = products;

		data['totalPrice'] = totalPrice;

		data['billingDate'] = Date.now();

		this.billingService.createBillings(data);

		this.router.navigate([ 'checkouts', { outlets: { checkOutlet: [ 'result' ] } } ]);
	}
}
