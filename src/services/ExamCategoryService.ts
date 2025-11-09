import Api from '@/lib/api';


export class ExamCategoryService {

    private static endpoint = 'exam-category/';

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form);
    }

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async details(id: number) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}update`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}delete`, {id});
    }
}