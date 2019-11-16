import { Injectable } from "@angular/core"; 
import { Router } from "@angular/router"; 
import { Cliente } from "../../_restClientes";
@Injectable()
export class AuthService {
 
  status: boolean = false;
  cliente: Cliente;
  
  constructor( 
    private router: Router 
  ) {
  }

  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true');
  }

   isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus);
  }

  setUser(cliente: Cliente) {
    this.cliente = cliente;
    localStorage.setItem('cliente', JSON.stringify(cliente));

  }
  getUsers(): Cliente {
    return JSON.parse(localStorage.getItem('cliente'));

  }
 
  

  logout() {
    this.status = false;
    this.loggedInStatus = false;
    localStorage.setItem('loggedIn', 'false');
    localStorage.setItem('cliente', JSON.stringify(null));
    console.log
    this.router.navigate(["/"]); 
  }
 

 

  
}
