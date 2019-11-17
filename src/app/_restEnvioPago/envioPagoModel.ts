interface ordenTrRequest {
  apellido: string;
  nombre: string;
  idCategoria: number;
  nomCat: string, 
  mail: string,
  direccion: string;
  pais: string;
  estado: string;
  ciudad: string;
  idOrden: number;
  valorTotal: number;
  cantidadProductos: number;
  proveedor : string; 
  items: Item[];
}

interface Item {
  nombreProducto: string; 
  iddetorden: number;
  idOrden: number;
  idProducto: string;
  cantidad: number;
  valorUnidad: number;
}

interface ordenTrResponse {
  status: Status;
  Response: string;
}

interface Status {
  statusCode: number;
  statusDesc: string;
}