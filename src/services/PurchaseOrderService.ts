import Api from "@/lib/api";

export class PurchaseOrderService {

    private static endpoint = "purchase-order/";

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form)
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form)
    }
    public static async update(form: any) {
        return Api(`${this.endpoint}update`, form)
    }

    public static async details(id: number) {
        return Api(`${this.endpoint}details`, {id})
    }

    public static async stats() {
        return Api(`${this.endpoint}stats`);
    }

    public static async receive(form: any){
        return Api(`${this.endpoint}receive`,form);
    }

    public static async invoice(refrence_no: any){
        return Api(`invoice`,{reference_no : refrence_no});
    }

    public static async print(id: number) {
        return Api(`${this.endpoint}print`, { id }, {
            responseType: 'blob'
        });
    }

}