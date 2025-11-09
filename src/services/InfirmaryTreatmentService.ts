import Api from "@/lib/api";

export class InfirmaryTreatmentService {

    private static endpoint = "infirmary-treatment/";

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async details(id: any) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async consentApproval(id: number, remark: string, status: number) {
        return Api(`${this.endpoint}consent-aproval`, { id, remark, status });
    }


    public static async requestTreatment(form: any) {
        return Api(`${this.endpoint}request`, form);
    }

    public static async getTreatmentRequest(infirmary_visit_log_id: number) {
        return Api(`${this.endpoint}request-details`, { infirmary_visit_log_id });
    }


    public static async stats(id: number) {
        return Api(`${this.endpoint}stats`, {id});
    }

    public static async getFullDetails(infirmary_visit_log_id: number) {
        return Api(`${this.endpoint}full-details`, { infirmary_visit_log_id })
    }

    public static async markCompleted(id: number, remarks: string) {
        return Api(`${this.endpoint}mark-complete`, { id, remarks });
    }


}