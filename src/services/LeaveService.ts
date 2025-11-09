import Api from "@/lib/api";

type formData = {
    id : number,
    status : string,
    remark : string,
} 

export class LeaveService {

    private static endpoint = '/admin';

    public static async getLeave (form: SearchFilters) {
        return Api(`${this.endpoint}/leave/request`,form);
    }

    public static async changeStatus(form: formData){
        return Api(`${this.endpoint}/leave/change-status`,form);
    }

}