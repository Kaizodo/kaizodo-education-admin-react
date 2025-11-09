import Api from '@/lib/api';


export class EmployeeHierarchyService {

    private static endpoint = 'employee-hierarchy/';

    public static async load() {
        return Api(`${this.endpoint}load`);
    }
    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async searchSubordinates(form: any) {
        return Api(`${this.endpoint}search-subordinates`, form);
    }

    public static async changeLeader(form: {
        user_id: number,
        to_user_id: number
    }) {
        return Api(`${this.endpoint}change-leader`, form);
    }

    public static async remove(user_id: number) {
        return Api(`${this.endpoint}remove`, { user_id });
    }
    public static async create(form: {
        user_id: number,
        subordinate_user_ids: number[]
    }) {
        return Api(`${this.endpoint}create`, form);
    }

}