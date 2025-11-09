import { LeaveTypeFor } from '@/data/user';
import Api from '@/lib/api';


export class LeaveTypeService {

    private static endpoint = 'leave-type';

    public static async all(form?: {
        is_for?: LeaveTypeFor,
        keyword?: string
    }) {
        return Api(`${this.endpoint}/all`, form);
    }


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



}