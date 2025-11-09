import Api from "@/lib/api";

export class AdmissionWindowRoundService {

    private static endpoint = 'admission-window-round';

    public static async all(admission_window_id: number) {
        return Api(`${this.endpoint}/all`, { admission_window_id });
    }

    public static async search(form: {
        admission_window_id: number,
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
        admission_window_id: number,
        id: number
    }) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }



    public static async updateOrder(order: {
        admission_window_round_id: number,
        sort_order: number
    }[]) {
        return Api(`${this.endpoint}/update-order`, order);
    }

    public static async submitFeedback(form: {
        application_progress_id: number,
        points: number,
        remarks: string,
        slabs: {
            id: number,
            value: number
        }[]
    }) {
        return Api(`${this.endpoint}/submit-feedback`, form);
    }
}