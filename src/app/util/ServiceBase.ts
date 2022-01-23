import { environment } from "../../environments/environment";

export class ServiceBase {

    baseURL: string = '';

    constructor() {
        this.baseURL = environment.apiUrl;
    }
}