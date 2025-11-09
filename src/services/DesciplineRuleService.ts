import Api from "@/lib/api";

export class DesciplineRuleService {

    private static endpoint = 'hostel-descipline-rule/';

    public static async search (form: any){
        return Api(`${this.endpoint}search`,form);
    }

    public static async create (form: any){
        return Api(`${this.endpoint}create`,form);
    }

    public static async update (form: any){
        return Api(`${this.endpoint}update`,form);
    }

    public static async details (id: number){
        return Api(`${this.endpoint}detail`,{id});
    }

    public static async delete (id: number){
        return Api(`${this.endpoint}delete`,{id});
    }
}