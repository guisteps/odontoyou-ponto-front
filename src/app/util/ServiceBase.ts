import { environment } from "../../environments/environment";

export class ServiceBase {
    
    baseURL: string = '';

    constructor() {
        if (environment.production)
            this.baseURL = environment.apiUrlProd;
        else
            this.baseURL = environment.apiUrl;
    }
}