import Api from "@/lib/api";

export class DashboardService { 

    private static endpoint = "dashboard/";

    public static async get(){
        return Api(`${this.endpoint}get`);
    }

    public static async notification(){
        return Api(`${this.endpoint}notification`);
    }

    public static async markNotification(form: any){
        return Api(`${this.endpoint}mark-read-notification`,form)
    }
}