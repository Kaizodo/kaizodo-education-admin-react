import Api from "@/lib/api";

export class AcademicMeetingService {

    private static endpoint = 'academic-meeting';

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
        return Api(`${this.endpoint}/modify`, form);
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async sendFeedback(form: any) {
        return Api(`${this.endpoint}/send-feedback`, form);
    }

    public static async detailsFeedback(meeting_id: number, student_id: number, user_id: number) {
        return Api(`${this.endpoint}/feedback-details`, { meeting_id, student_id, user_id });
    }

    public static async dashboard() {
        return Api(`${this.endpoint}/dashboard`);
    }

    public static async changeStatus(meeting_id: number, status: number){
        return Api(`${this.endpoint}/change-status`, {meeting_id, status});
    }  

}