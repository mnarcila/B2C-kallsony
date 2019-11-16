import { UserComponent } from './user.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth_gaurd';
import { DireccionesComponent } from './direcciones/direcciones.component';
import { OrdenesComponent } from './ordenes/ordenes.component';

export const UserRoutes: Routes = [
	{
		path: 'users',
		component: UserComponent,
		canActivate: [ AuthGuard ],
		children: [
			{
				path: '',
				component: UserAccountComponent,
				outlet: 'profileOutlet'
			},
			{
				path: 'direcciones',
				component: DireccionesComponent,
				outlet: 'profileOutlet'
			},
			{
				path: 'ordenes',
				component: OrdenesComponent,
				outlet: 'profileOutlet'
			}


		]
	}
];
