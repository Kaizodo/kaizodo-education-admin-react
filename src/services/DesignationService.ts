import Api from '@/lib/api';


export class DesignationService {

    private static endpoint = 'designation';

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

    public static async loadWeekOffConfiguration(id: number) {
        return Api(`${this.endpoint}/load-weekoff-configuration`, { id });
    }

    public static async saveWeekOffConfiguration(form: {
        designation_id: number,
        mode: string,
        fixed_days: any[],
        alternate_days: any,
    }) {
        return Api(`${this.endpoint}/save-weekoff-configuration`, form);
    }


    public static async loadLeaveConfiguration(id: number) {
        return Api(`${this.endpoint}/load-leave-configuration`, { id });
    }

    public static async saveLeaveConfiguration(form: {
        designation_id: number,
        leave_types: {
            id: number,
            quota: number
        }[]
    }) {
        return Api(`${this.endpoint}/save-leave-configuration`, form);
    }



    public static async loadFeedbackConfiguration(id: number) {
        return Api(`${this.endpoint}/load-feedback-configuration`, { id });
    }

    public static async saveFeedbackConfiguration(form: {
        designation_id: number,
        probation_criteria_ids: number[]
    }) {
        return Api(`${this.endpoint}/save-feedback-configuration`, form);
    }
}