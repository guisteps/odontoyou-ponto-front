import { Router } from "@angular/router";

export class ValidarAutenticacao {

    constructor(public route: Router) {
        if (!localStorage.getItem('token') || !this.validaExpiracao()) {
            route.navigate(['']);
        }
    }

    validaExpiracao() {
        if (!localStorage.getItem('expires'))
            return false;

        const agora = new Date().getTime();
        const dtExpiracao = localStorage.getItem('expires') as string;
        if (agora > Number(dtExpiracao)) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            return false;
        }

        return true;
    }

}