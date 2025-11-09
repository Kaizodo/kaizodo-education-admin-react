import Api from "@/lib/api";

export class StudentAdmissionReports {

    private static endpoint = "admission-report/";

    public static async admissionOverview(session_id?: number, class_id?: number, month?: number) {
        return Api(`${this.endpoint}overview`, { session_id, class_id, month });
    }

    public static async classWiseAdmissionRegister(session_id?: number) {
        return Api(`${this.endpoint}export-admission-comprison`, { session_id }, {
            download: true
        });
    }

}