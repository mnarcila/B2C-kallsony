export * from './detalleOrden.service';
import { DetalleOrdenService } from './detalleOrden.service';
export * from './orden.service';
import { OrdenService } from './orden.service';
export const APIS = [DetalleOrdenService, OrdenService];
