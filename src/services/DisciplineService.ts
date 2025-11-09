import Api from "@/lib/api";

export class DisciplineService {

    private static endpoint = 'hostel-discipline/';

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

    public static async stats (){
        return Api(`${this.endpoint}stats`);
    }

    public static async fullDetails (id: number){
        return Api(`${this.endpoint}full-details`,{id});
    }
}