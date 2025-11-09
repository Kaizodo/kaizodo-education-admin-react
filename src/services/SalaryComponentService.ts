import Api from '@/lib/api';


export class SalaryComponentService {

    private static endpoint = 'salary-component';

    public static async all() {
        return Api(`${this.endpoint}/all`);
    }

    public static async search(form: {
        class_id?: number,
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

    public static async updateSortOrder(records: any[]) {
        return Api(`${this.endpoint}/update-sort-order`, { records });
    }


    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }


}