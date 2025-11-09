import Api from "@/lib/api";

type InventoryForm = {
    id?: string;
    name: string;
}

export class InventoryCategoryService {

    // private static endpoint = '/admin';

    public static async create(form: InventoryForm){
        return Api(`inventory-category/create`,form)
    }

    public static async search(form: any){
        return Api(`inventory-category/search`,form)
    }

    public static async details(Id: string | number){
        return Api(`inventory-category/detail`,{id : Id})
    }

    public static async update(form: InventoryForm){
        return Api(`inventory-category/update`,form)
    }

    public static async delete(Id: string | number){
        return Api(`inventory-category/delete`,{id : Id})
    }
}