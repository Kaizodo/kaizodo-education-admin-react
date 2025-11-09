import Api from '@/lib/api';


export class RosterService {

    private static endpoint = 'roster';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async searchWorkingEmployees(form: any) {
        return Api(`${this.endpoint}/search-working`, form);
    }


    public static async searchNonWorkingEmployees(form: any) {
        return Api(`${this.endpoint}/search-non-working`, form);
    }

    public static async assignShift(form: any) {
        return Api(`${this.endpoint}/assign-shift`, form);
    }

    public static async unassignShift(form: {
        user_id: number,
        date: string
    }) {
        return Api(`${this.endpoint}/unassign-shift`, form);
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



}