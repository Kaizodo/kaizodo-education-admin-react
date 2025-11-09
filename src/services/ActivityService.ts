import Api from "@/lib/api";

export class ActivityService {

    private static endpoint = 'activity';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async getParticipateUser(form: any) {
        return Api(`${this.endpoint}/participate-user`, form);
    }

    public static async giveMarks(student_id: number, activity_id: number, remarks: string, points: number) {
        return Api(`${this.endpoint}/give-marks`, { student_id, activity_id, remarks, points });
    }




}