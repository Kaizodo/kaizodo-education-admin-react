import Api from "@/lib/api";

export class CampaignQuestionService {

    private static endpoint = 'campaign-question';

    public static async all(campaign_id: number) {
        return Api(`${this.endpoint}/all`, { campaign_id });
    }

    public static async search(form: {
        campaign_id: number,
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
        campaign_id: number
    }) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }




}