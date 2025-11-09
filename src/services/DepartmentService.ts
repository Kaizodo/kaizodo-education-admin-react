import Api from '@/lib/api';


export class DepartmentService {

    private static endpoint = 'department';



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

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async assignUser(form: {
        department_id: number,
        user_id: number
    }) {
        return Api(`${this.endpoint}/assign-user`, form);
    }

    public static async removeUser(form: {
        department_id: number,
        user_id: number
    }) {
        return Api(`${this.endpoint}/remove-user`, form);
    }
}