import Api from "@/lib/api";

export class CareerInterviewRoundService {

    private static endpoint = 'career-interview-round';

    public static async all(career_id: number) {
        return Api(`${this.endpoint}/all`, { career_id });
    }

    public static async search(form: {
        career_id: number,
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

    public static async detail(form: {
        career_id: number,
        id: number
    }) {
        return Api(`${this.endpoint}/detail`, form);
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

    public static async updateOrder(order: {
        career_interview_round_id: number,
        sort_order: number
    }[]) {
        return Api(`${this.endpoint}/update-order`, order);
    }


}