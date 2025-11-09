import { PaymentMode } from '@/data/Payment';
import Api from '@/lib/api';


export class PayrollService {

    private static endpoint = 'payroll';

    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async load(form: {
        user_id: number,
        date: string
    }) {
        return Api(`${this.endpoint}/load`, form);
    }


    public static async export(form: any) {
        return Api(`${this.endpoint}/export`, form, {
            download: true
        });
    }


    public static async recordPayment(form: {
        user_id: number,
        date: string,
        components: {
            salary_component_id: number,
            amount: number
        }[],
        payment_date: string,
        payment_mode: PaymentMode,
        remarks: string
    }) {
        return Api(`${this.endpoint}/record-payment`, form);
    }

    public static async print(form: {
        user_id: number,
        dates: string[],
    }) {
        return Api(`${this.endpoint}/print`, form, {
            responseType: 'blob'
        });
    }

}