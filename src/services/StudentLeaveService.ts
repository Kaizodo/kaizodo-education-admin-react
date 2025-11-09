import Api from "@/lib/api";

export class StudentLeaveService {

    private static endpoint = "student-leave/";

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async escalated(form: any) {
        return Api(`${this.endpoint}escalated`, form);
    }

    public static async details(id: number) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async process(form: number) {
        return Api(`${this.endpoint}change-status`, form);
    }
}