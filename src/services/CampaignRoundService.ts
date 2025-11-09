import Api from "@/lib/api";

export class CampaignRoundService {

    private static endpoint = 'campaign-round';

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
        campaign_id: number,
        id: number
    }) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }



    public static async updateOrder(order: {
        interview_round_id: number,
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

    public static async markAsComplete(form: any) {
        return Api(`${this.endpoint}/mark-as-complete`, form);
    }

    public static async searchScheduledCandidates(form: any) {
        return Api(`${this.endpoint}/search-scheduled-candidates`, form);
    }



    public static async attendanceDetail(interview_round_id: number) {
        return Api(`${this.endpoint}/attendance-detail`, { interview_round_id });
    }

    public static async attendanceStats(interview_round_id: number) {
        return Api(`${this.endpoint}/attendance-stats`, { interview_round_id });
    }



    public static async attendanceSearch(form: any) {
        return Api(`${this.endpoint}/attendance-search`, form);
    }

    public static async attendanceUpdate(form: any) {
        return Api(`${this.endpoint}/attendance-update`, form);
    }

    public static async roundStatusPoll(application_progress_id: number) {
        return Api(`${this.endpoint}/round-status-poll`, { application_progress_id });
    }



    public static async roundStart(application_progress_id: number) {
        return Api(`${this.endpoint}/round-start`, { application_progress_id });
    }

    public static async printRollNumberMap(form: {
        interview_round_id: number,
        date: string,
    }) {
        return Api(`${this.endpoint}/print-roll-number-map`, form, {
            responseType: 'blob'
        });
    }

    public static async printSeatLabels(form: {
        interview_round_id: number,
        date: string,
    }) {
        return Api(`${this.endpoint}/print-seat-labels`, form, {
            responseType: 'blob'
        });
    }
}