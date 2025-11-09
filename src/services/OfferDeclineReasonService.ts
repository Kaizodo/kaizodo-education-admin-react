import { CampaignType } from '@/data/campaign';
import Api from '@/lib/api';


export class OfferDeclineReasonService {

    private static endpoint = 'offer-decline-reason';

    public static async all() {
        return Api(`${this.endpoint}/all`);
    }

    public static async search(form: {
        campaign_type?: CampaignType,
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


}