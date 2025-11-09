import Api from '@/lib/api';


export class SubscriptionFeatureService {

    private static endpoint = 'subscription-feature';

    public static async all() {
        return Api(`${this.endpoint}/all`);
    }

    public static async search(form: any) {
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

    public static async loadContent(id: number) {
        return Api(`${this.endpoint}/load-content`, { id });
    }


    public static async saveContent(form: any) {
        return Api(`${this.endpoint}/save-content`, form);
    }

}