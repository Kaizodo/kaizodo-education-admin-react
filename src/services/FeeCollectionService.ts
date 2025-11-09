import { PaymentMode } from '@/data/Payment';
import Api from '@/lib/api';


export class FeeCollectionService {

    private static endpoint = 'fee-collection';

    public static async stats(form: {
        date?: string
    }) {
        return Api(`${this.endpoint}/stats`, form);
    }

    public static async load(form: {
        user_id: number,
        session_id?: number
    }) {
        return Api(`${this.endpoint}/load`, form);
    }

    public static async feeForMonth(form: {
        user_id: number,
        session_id: number,
        date: string
    }) {
        return Api(`${this.endpoint}/fee-for-month`, form);
    }

    public static async paymentHistory(form: {
        user_id: number,
        session_id: number

    }) {
        return Api(`${this.endpoint}/payment-history`, form);
    }

    public static async paymentCollect(form: {
        user_fee_schedule_ids: number[],
        amount: number,
        reference_number: string,
        payment_date: string,
        user_id: number,
        session_id: number,
        payment_mode: PaymentMode;
        remarks: string;
    }) {
        return Api(`${this.endpoint}/payment-collect`, form);
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


    public static async print(form: {
        user_id: number,
        fee_collection_ids: number[]
    }) {
        return Api(`${this.endpoint}/print`, form, {
            responseType: 'blob'
        });
    }


    public static async getParticulars(user_fee_schedule_id: number) {
        return Api(`${this.endpoint}/particulars`, { user_fee_schedule_id });
    }

}