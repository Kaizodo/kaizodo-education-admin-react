import Api from "@/lib/api";

export class InfirmaryCheckupService {

    private static endpoint = "infirmary-checkup/";


    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async list(form: any) {
        return Api(`${this.endpoint}list`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form);
    }

    public static async getCheckup(id: number, infirmary_visit_log_id: number) {
        return Api(`${this.endpoint}get`, { id, infirmary_visit_log_id });
    }

    public static async checkupReport(form: any) {
        return Api(`${this.endpoint}report`, form)
    }

    public static async stats(id: number) {
        return Api(`${this.endpoint}stats`, { id })
    }

    public static async uploadMedia(form: {
        file: File,
        infirmary_health_checkup_report_id: number
    }, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}upload-media`, form, {
            onUploadProgress
        });
    }

    public static async deleteMedia(form: {
        infirmary_health_checkup_report_document_id: number,
        infirmary_health_checkup_report_id: number
    }) {
        return Api(`${this.endpoint}delete-media`, form);
    }

    public static async detail(infirmary_health_checkup_id: number, infirmary_visit_log_id: number) {
        return Api(`${this.endpoint}detail`, { infirmary_health_checkup_id, infirmary_visit_log_id })
    }

}