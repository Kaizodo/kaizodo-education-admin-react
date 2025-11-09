import Api from "@/lib/api";

export class IndentService {

    private static endpoint = "indent/";

     public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form);
    }
    
    public static async update(form: any) {
        return Api(`${this.endpoint}update`, form);
    }

    public static async details(id: any) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async delete(id: any) {
        return Api(`${this.endpoint}delete`, { id });
    }

    public static async get(form: any){
        return Api(`${this.endpoint}request`,form);
    }

    public static async getDetails(id: number){
        return Api(`${this.endpoint}get-details`,{id});
    }

    public static async getHistory(form: any){
        return Api(`${this.endpoint}get-history`,form);
    }

    public static async changeStatus(form: any){
        return Api(`${this.endpoint}change-status`,form);
    }

    public static async stats(){
        return Api(`${this.endpoint}stats`)
    }
}