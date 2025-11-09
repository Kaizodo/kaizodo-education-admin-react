import Api from "@/lib/api";

export class UserTicketCategoryService {

    private static endpoint = 'user-ticket-category/';

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

    public static async approval(data: any){
        return Api(`${this.endpoint}approval`,data);
    }
}