import Api from "@/lib/api";

type PeriodForm = {
    id?: string;
    brand: string;
    category: string;
    itemName: string;
    location: string;
    minimumStock: string;
    quantity: string;
    unit: string;
    unitPrice: string;
}

export class PeriodServices {

    private static endpoint = '/admin';

    public static async createPeriod(form: PeriodForm){
        return Api(`${this.endpoint}/timing/create`,form)
    }

    public static async getPeriod(form: SearchFilters){
        return Api(`${this.endpoint}/timing/get`,form)
    }

    public static async getPeriodDetails(Id: string | number){
        return Api(`${this.endpoint}/timing/details`,{timing_id : Id})
    }

    public static async updatePeriod(form: PeriodForm){
        return Api(`${this.endpoint}/timing/update`,form)
    }

    public static async deletePeriod(Id: string | number){
        return Api(`${this.endpoint}/timing/delete`,{timing_id : Id})
    }
}