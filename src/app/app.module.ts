import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { IndexModule } from './index/index.module';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
import { TranslateService } from './shared/services/translate.service';
import { ProductModule } from './layouts/product/product.module';
import { UserModule } from './layouts/user/user.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
 
//inject de locales
import { Cliente, ClienteService, ClientesRsType } from './_restClientes';
import { OrdenRsType, OrdenService, StatusType, DetalleOrdenService, OrdenM, DetalleOrden } from 'src/app/_restOrdenes';
import { CampanaService} from 'src/app/_restCampana';
import { ReqCategoria, CategoriaService, CategoriaRsType } from './_restCategoria';
import { Producto, ProductoService, ProductoRsType } from './_restProducto';
import { tarjetaService } from './_tarjetaCredito/tarjeta.service';
import { envioPagoService } from './_restEnvioPago/envioPago.Service';
import { MailSendService } from './_restMail';
import { TarjetaCreditoService } from './_restTarjetaCredito';
import { serviceEstadoProv } from './_estadoProv/serviceEstadoProv';
// import { trajetaService } from 'src/app/_tarjetaCredito';

/* to load and set en.json as the default application language */
export function setupTranslateFactory(service: TranslateService): Function {
	return () => service.use('en');
}

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		IndexModule,
		ReactiveFormsModule,
		ProductModule,
		FormsModule,
		UserModule,
		SharedModule,
		RouterModule.forRoot(AppRoutes),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [ 
		OrdenService,
		DetalleOrdenService, 
		AuthService,
		ProductoService,
		CategoriaService,
		TranslateService,
		ClienteService,
		CampanaService, 
		tarjetaService,
		FormBuilder,
		envioPagoService,
		MailSendService,
		TarjetaCreditoService,
		serviceEstadoProv,
		{
			provide: APP_INITIALIZER,
			useFactory: setupTranslateFactory,
			deps: [ TranslateService ],
			multi: true
		}
	],
	bootstrap: [ AppComponent ],
	schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {}
