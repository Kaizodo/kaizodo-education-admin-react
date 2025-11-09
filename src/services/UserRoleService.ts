import Api from '@/lib/api';


export class UserRoleService {

    private static endpoint = 'user-role';

    public static async all() {
        return Api(`${this.endpoint}/all`);
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

    public static async loadLeaveConfiguration(id: number) {
        return Api(`${this.endpoint}/load-leave-configuration`, { id });
    }

    public static async saveLeaveConfiguration(form: {
        user_role_id: number,
        leave_types: {
            id: number,
            balance: number
        }[]
    }) {
        return Api(`${this.endpoint}/save-leave-configuration`, form);
    }

    public static async loadWorkConfiguration(id: number) {
        return Api(`${this.endpoint}/load-work-configuration`, { id });
    }

    public static async saveWorkConfiguration(form: {
        user_role_id: number,
        leave_types: {
            id: number,
            balance: number
        }[]
    }) {
        return Api(`${this.endpoint}/save-work-configuration`, form);
    }


}