interface dhlResponse {
  checkShipmentStatusResult: string;
}

interface servientregaResponse {
  status: Status;
  Response: string;
}

interface Status {
  statusCode: number;
  statusDesc: string;
}