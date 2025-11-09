import Api from '@/lib/api';


export class HolidayService {

    private static endpoint = 'holiday';

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

    public static async reschedule(form: {
        holiday_id: number,
        date_from: string,
        date_to: string
    }) {
        return Api(`${this.endpoint}/reschedule`, form);
    }

    public static async removeSchedule(form: {
        holiday_id: number,
        date: string
    }) {
        return Api(`${this.endpoint}/remove-schedule`, form);
    }

    public static async createSchedule(form: {
        holiday_id: number,
        date_from: string,
        date_to: string
    }) {
        return Api(`${this.endpoint}/create-schedule`, form);
    }

    public static async loadCalendar(date: string) {
        return Api(`${this.endpoint}/load-calendar`, { date });
    }

    public static async autoGenerateCalendar(date: string) {
        return Api(`${this.endpoint}/auto-generate-calendar`, { date });
    }


}