import Api from "@/lib/api";

type ShiftForm = {
    id?: string;
    shift_name: string;
    start_time: string;
    end_time: string;
    breaks: [];
    description: string;
}

export class ShiftServices {

    private static endpoint = '/admin';

    public static async createShift(form: ShiftForm){
        return Api(`${this.endpoint}/shift/create`,form)
    }

    public static async getShift(form: SearchFilters){
        return Api(`${this.endpoint}/shift/get`,form)
    }

    public static async getShiftDetails(Id: string | number){
        return Api(`${this.endpoint}/shift/details`,{id : Id})
    }

    public static async updateShift(form: ShiftForm){
        return Api(`${this.endpoint}/shift/update`,form)
    }

    public static async deleteShift(Id: string | number){
        return Api(`${this.endpoint}/shift/delete`,{id : Id})
    }
}