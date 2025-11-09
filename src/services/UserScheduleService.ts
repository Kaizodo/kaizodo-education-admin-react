import Api from "@/lib/api";

export class UserScheduleService {

    private static endpoint = 'user-schedule/';

    public static async load(form: any) {
        return Api(`${this.endpoint}load`, form);
    }



}