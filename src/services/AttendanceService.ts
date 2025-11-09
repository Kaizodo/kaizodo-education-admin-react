import Api from "@/lib/api";

export class AttendanceService {

    private static endpoint = 'student-attendnace/';

    public static async getStudents(form: any) {
        return Api(`${this.endpoint}get`, form);
    }

}