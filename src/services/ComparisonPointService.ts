import Api from '@/lib/api';


export class ComparisonPointService {

    private static endpoint = 'comparison-point';


    public static async load() {
        return Api(`${this.endpoint}/load`);
    }

    public static async save(form: any) {
        return Api(`${this.endpoint}/save`, form);
    }





}