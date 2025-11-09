import Api from '@/lib/api';


export class FaqService {

    private static endpoint = 'faq';


    public static async load() {
        return Api(`${this.endpoint}/load`);
    }

    public static async save(form: any) {
        return Api(`${this.endpoint}/save`, form);
    }





}