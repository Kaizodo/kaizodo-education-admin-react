import Api from '@/lib/api';


export class FaqService {

    private static endpoint = 'faq';


    public static async load(form: { organization_id: number }) {
        return Api(`${this.endpoint}/load`, form);
    }

    public static async save(form: any) {
        return Api(`${this.endpoint}/save`, form);
    }





}