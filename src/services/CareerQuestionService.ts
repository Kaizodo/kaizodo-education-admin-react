import Api from "@/lib/api";

export class CareerQuestionService {

    private static endpoint = 'career-question';

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
        career_custom_field_id: number
    }) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }




}