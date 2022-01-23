import { environment } from "../../environments/environment.prod";

export class ServiceBase {

    baseURL: string = '';

    constructor() {
        this.baseURL = environment.apiUrl;
    }
}