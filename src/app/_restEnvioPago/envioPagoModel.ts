interface ordenTrRequest {
  apellido: string;
  nombre: string;
  idCategoria: number;
  direccion: string;
  pais: string;
  estado: string;
  ciudad: string;
  idOrden: number;
  valorTotal: number;
  cantidadProductos: number;
  items: Item[];
}

interface Item {
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