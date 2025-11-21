import Api from '@/lib/api';


export class ReferralEarningWithdrawalService {

    private static endpoint = 'referral-earning-withdrawal';


    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async updateItemStatus(form: any) {
        return Api(`${this.endpoint}/update-item-status`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }



}