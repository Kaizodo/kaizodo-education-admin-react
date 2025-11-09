import Api from "@/lib/api";

export class VisitorService {

    private static endpoint = 'visitor/';

    public static async search (form: any){
        return Api(`${this.endpoint}search`,form);
    }

    public static async create (form: any){
        return Api(`${this.endpoint}create`,form);
    }

    public static async request(form: any){
        return Api(`${this.endpoint}request`,form)
    }

    public static async requestDetails(id: number){
        return Api(`${this.endpoint}request-details`, {id});
    }

    public static async list(form: any){
        return Api(`${this.endpoint}list`,form);
    }

    public static async approval(form: any){
        return Api(`${this.endpoint}approval`,form);
    }

    public static async stats(){
        return Api(`${this.endpoint}stats`);
    }

    public static async attendance(id: number, status: number) {
        return Api(`${this.endpoint}attendance`,{visitor_request_id: id, status: status});
    }
}