import Api from '@/lib/api';


export class ExamSectionService {

    private static endpoint = 'exam-section';




    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(form: { id: number, organization_id: number }) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async delete(form: { id: number, organization_id: number }) {
        return Api(`${this.endpoint}/delete`, form);
    }


}