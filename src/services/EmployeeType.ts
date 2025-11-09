import Api from "@/lib/api";

export class EmployeeTypes {

    private static endpoint = '/admin';

    public static async search (form: SearchFilters){
        return Api(`${this.endpoint}/user/get-utype`,form);
    }

    public static async getPermission (){
        return Api(`${this.endpoint}/permission/fetch`);
    }

    public static async createEmployeeType(form : EmployeeTypeForm){
        return Api(`${this.endpoint}/user/add-utype`,form);
    }

    public static async fetchEmployeeType(Id: string | number){
        return Api(`${this.endpoint}/user-type/details`,{user_type : Id});
    }

    public static async updateEmployeeType(form : EmployeeTypeForm){
        return Api(`${this.endpoint}/user/update-utype`,form);
    }

    public static async deleteEmployeeType(Id: string | number){
        return Api(`${this.endpoint}/user-type/delete`,{user_type_id : Id});
    }
}