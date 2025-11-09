import { InterviewRoundFor } from '@/data/Interview';
import Api from '@/lib/api';


export class InterviewRoundService {

    private static endpoint = 'interview-round';

    public static async copy(form: {
        from_career_category_id: number,
        to_career_category_id: number

    }) {
        return Api(`${this.endpoint}/copy`, form);
    }

    public static async load(form: {
        interview_round_for: InterviewRoundFor,
        career_category_id?: number
    }) {
        return Api(`${this.endpoint}/load`, form);
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


    public static async updateOrder(order: {
        interview_round_id: number,
        sort_order: number
    }[]) {
        return Api(`${this.endpoint}/update-order`, order);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async addUser(form: any) {
        return Api(`${this.endpoint}/add-user`, form);
    }

    public static async removeUser(form: any) {
        return Api(`${this.endpoint}/remove-user`, form);
    }

    public static async updateBoard(form: any) {
        return Api(`${this.endpoint}/update-board`, form);
    }
    public static async removeBoard(form: any) {
        return Api(`${this.endpoint}/remove-board`, form);
    }


    public static async addLocation(form: any) {
        return Api(`${this.endpoint}/add-location`, form);
    }

    public static async removeLocation(form: any) {
        return Api(`${this.endpoint}/remove-location`, form);
    }





    public static async bulkCreateGroups(form: {
        career_interview_round_id?: number,
        admission_window_round_id?: number,
        capacity: number,
        quantity: number
    }) {
        return Api(`${this.endpoint}/bulk-create-groups`, form);
    }


    public static async loadGroup(id: number) {
        return Api(`${this.endpoint}/load-group`, { id });
    }

    public static async createGroup(form: any) {
        return Api(`${this.endpoint}/create-group`, form);
    }


    public static async updateGroup(form: any) {
        return Api(`${this.endpoint}/update-group`, form);
    }

    public static async removeGroup(id: number) {
        return Api(`${this.endpoint}/delete-group`, { id });
    }


}