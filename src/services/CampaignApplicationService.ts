import { CampaignSelectionStatus } from '@/data/campaign';
import { ApplicationStatus } from '@/data/Interview';
import Api from '@/lib/api';


export class CampaignApplicationService {

    private static endpoint = 'campaign-application';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id })
    }

    public static async approval(form: {
        id: number,
        status: ApplicationStatus,
        status_remarks: string
    }) {
        return Api(`${this.endpoint}/approval`, form);
    }

    public static async bulkApproval(form: any) {
        return Api(`${this.endpoint}/bulk-approve`, form);
    }

    public static async bulkFinalSelection(form: any) {
        return Api(`${this.endpoint}/bulk-final-selection`, form);
    }

    public static async admit(id: number) {
        return Api(`${this.endpoint}/admit`, { id });
    }

    public static async print(id: number) {
        return Api(`${this.endpoint}/print`, { id }, {
            responseType: 'blob'
        });
    }

    public static async createSelectionList(form: any) {
        return Api(`${this.endpoint}/create-selection-list`, form);
    }

    public static async searchSelectionList(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search-selection-list`, form);
    }

    public static async allSelectionList(form: {
        campaign_id: number,
        status: CampaignSelectionStatus
    }) {
        return Api(`${this.endpoint}/all-selection-list`, form);
    }

    public static async sendOfferToSelected(form: any) {
        return Api(`${this.endpoint}/send-offer-to-selected`, form);
    }

    public static async updateOfferOfSelected(form: any) {
        return Api(`${this.endpoint}/update-offer-of-selected`, form);
    }


    public static async processSelectionList(form: {
        id: number,
        status: CampaignSelectionStatus,
        remarks?: string
    }) {
        return Api(`${this.endpoint}/process-selection-list`, form);
    }

    public static async searchSelectionApplicationsList(form: any) {
        return Api(`${this.endpoint}/search-selection-applications-list`, form);
    }


    public static async getAvailabilityStats(form: {
        date: string,
        campaign_id: number,
        interview_round_id: number,
        interview_slot_id: number
    }) {
        return Api(`${this.endpoint}/availability-stats`, form);
    }

    public static async scheduleInterview(form: {
        user_ids: number[],
        admission_id: number,
        admission_window_round_id: number,
        datetime: string
    }) {
        return Api(`${this.endpoint}/create-schedule`, form);
    }

    public static async loadSchedules(form: {
        admission_window_round_id: number
    }) {
        return Api(`${this.endpoint}/load-schedule`, form);
    }



    public static async shortlistApplications(form: {
        filters: any,
        data: {
            admission_window_id: number,
            applications: number,
            admission_window_round_id?: number | boolean,
            date_start: string,
            date_end: string,
            gap: number,
            user_ids: number[],
            selected: number[]
        }
    }) {
        return Api(`${this.endpoint}/shortlist-applications`, form);
    }

    public static async submitCutoffPointChangeRequest(form: any) {
        return Api(`${this.endpoint}/submit-cutoff-point-change-request`, form);
    }

    public static async approveCutoffPointChangeRequest(form: any) {
        return Api(`${this.endpoint}/approve-cutoff-point-change-request`, form);
    }

}