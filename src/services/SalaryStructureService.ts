import Api from '@/lib/api';


export class SalaryStructureService {

    private static endpoint = 'salary-structure';

    public static async search(form: {
        class_id?: number,
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }


    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }


}