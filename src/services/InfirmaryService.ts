import Api from "@/lib/api";

export class InfirmaryService {

    private static endpoint = "infirmary/";


    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}update`, form);
    }

    public static async details(id: any) {
        return Api(`${this.endpoint}details`, { id });
    }

    public static async delete(id: any) {
        return Api(`${this.endpoint}delete`, { id });
    }

    public static async assignUser(infirmary_id: number, user_id: number) {
        return Api(`${this.endpoint}assign-user`, { infirmary_id, user_id });
    }

    public static async removeUser(infirmary_id: number, user_id: number) {
        return Api(`${this.endpoint}remove-user`, { infirmary_id, user_id });
    }

    public static async getAssignUser(form: any) {
        return Api(`${this.endpoint}get-assign-user`, form);
    }

    public static async getVisitReason(form: any) {
        return Api(`${this.endpoint}visit-reason`, form);
    }

    public static async createVisitLog(form: any) {
        return Api(`${this.endpoint}create-visit-log`, form);
    }

    public static async getVisitorLog(form: any) {
        return Api(`${this.endpoint}get-visit-log`, form);
    }

    public static async fistAid(form: any) {
        return Api(`${this.endpoint}get-first-aid`, form);
    }

    public static async giveFirstAid(infirmary_visit_log_id: number, infirmary_first_aid_id: number) {
        return Api(`${this.endpoint}give-first-aid`, { infirmary_visit_log_id, infirmary_first_aid_id });
    }

    public static async getVisitorFistAid(infirmary_visit_log_id: number) {
        return Api(`${this.endpoint}get-visit-first-aid`, { infirmary_visit_log_id });
    }

    public static async getTreatments(form: any) {
        return Api(`${this.endpoint}get-treatment`, form);
    }
    public static async getCheckupParameter(form: any) {
        return Api(`${this.endpoint}get-checkup-parameter`, form);
    }
    public static async getSymptoms(form: any) {
        return Api(`${this.endpoint}get-symptoms`, form);
    }

    public static async closeVisit(id: number, remarks: string) {
        return Api(`${this.endpoint}close-visit`, { id, remarks });
    }

    public static async openVisit(id: number, remarks: string) {
        return Api(`${this.endpoint}open-visit`, { id, remarks });
    }

    public static async changeAppointment(id: number, appointment_date: any) {
        return Api(`${this.endpoint}change-appointment`, { id, appointment_date });
    }

    public static async stats(id: number) {
        return Api(`${this.endpoint}stats`,{id});
    }
}