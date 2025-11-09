import Api from "@/lib/api";

export class StoreService {


    public static async getEmployee(){
        return Api(`store/get-employee`)
    }

    public static async search(form: any){
        return Api(`store/search`,form)
    }

    public static async create(form: any){
        return Api(`store/create`,form)
    }

    public static async details(Id: number){
        return Api(`store/detail`,{id : Id})
    }

    public static async update(form: any){
        return Api(`store/update`,form)
    }

    public static async delete(Id: string | number){
        return Api(`store/delete`,{id : Id})
    }
}