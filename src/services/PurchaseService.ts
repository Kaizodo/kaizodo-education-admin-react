import Api from "@/lib/api";

export class PurchaseService {

    private static endpoint = "purchase/";

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async details(id: number){
        return Api(`${this.endpoint}details`,{id});
    }

    public static async approvedRequest(form: any){
        return Api(`${this.endpoint}approved`,form)
    }

    public static async rejectRequest(id: number){
        return Api(`${this.endpoint}reject`,{id})
    }

    public static async stats(){
        return Api(`${this.endpoint}stats`);
    }
}