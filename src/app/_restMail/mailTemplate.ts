import { environment } from "src/environments/environment.prod";



export class MailTemplate {

    getPlantillaMensaje(pUsuario: string) {
        var cuerpo = " Bienvenido a Kallsonys  " +
            "Gracias por registrar en kallsonys, " + pUsuario +
            " recuerda que puedes realizar tus compras desde este mismo momento" +
            ' en la siguiente ruta:  ' + environment.rutaPagina + ' ' +
            "Disfruta de nuestros productos!"

        return cuerpo;
    }
    getPlantillaTitulo() {
        return "Bienvenido a kallsonys"
    }
}
