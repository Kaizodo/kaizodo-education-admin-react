import Api from "@/lib/api";

export class StockService{

    private static endpoint = "stock/";

    public static async search(form: any){
        return Api(`${this.endpoint}search`, form);
    }

    public static async create(form: any){
        return Api(`${this.endpoint}create`,form);
    }

    public static async update(form: any){
        return Api(`${this.endpoint}update`,form);
    }

    public static async return (form: any){
        return Api(`stock-item/return`,form);
    }

    public static async returnSearch(form: any){
        return Api(`stock-item/search`, form);
    }
    
    
    public static async returnDetails(id: number){
        return Api(`stock-item/details`, {id});
    }

    public static async approveStock(form: any){
        return Api('stock-item/approve',form);
    }
}