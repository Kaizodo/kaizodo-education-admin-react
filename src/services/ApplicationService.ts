import Api from '@/lib/api';


export class ApplicationService {

    private static endpoint = 'career-application';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id })
    }

    public static async approval(id: number, status: number) {
        return Api(`${this.endpoint}/approval`, { id: id, status: status });
    }

    public static async admit(id: number) {
        return Api(`${this.endpoint}/admit`, { id });
    }

    public static async scheduleInterview(form: {
        application_id: number,
        career_interview_round_id: number,
        datetime: string
    }) {
        return Api(`${this.endpoint}/schedule`, form);
    }

}