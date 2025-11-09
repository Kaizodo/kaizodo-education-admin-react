import Api from "@/lib/api";

export class UserAttendanceService {

    private static endpoint = 'user-attendance';


    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }



    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }


    public static async stats(form: any) {
        return Api(`${this.endpoint}/stats`, form);
    }

    public static async searchMonthly(form: {
        user_id: number,
        date: string
    }) {
        return Api(`${this.endpoint}/search-monthly`, form);
    }

    public static async searchStudentMonthly(form: {
        user_id: number,
        date: string
    }) {
        return Api(`${this.endpoint}/search-monthly-student`, form);
    }

}