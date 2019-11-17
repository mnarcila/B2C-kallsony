// Core Dependencies
import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductModule } from '../layouts/product/product.module';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
// Components
import { IndexComponent } from './index.component';
import { IndexRoutes } from './index.routing';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';




@NgModule({
	imports: [ NgxSpinnerModule , CommonModule, ProductModule, SharedModule, RouterModule.forChild(IndexRoutes) ],
	declarations: [ IndexComponent, NavbarComponent, LoginComponent, FooterComponent ],
	schemas: [ NO_ERRORS_SCHEMA ],
	exports: [ NavbarComponent, FooterComponent ],
	providers: []
})
export class IndexModule {}
