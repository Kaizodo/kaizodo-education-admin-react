import Api from "@/lib/api";

export class PurchaseReportsService {

    private static endpoint = "purchase-reports/";

    public static async purchaseReports(session_id?: number) {
        return Api(`${this.endpoint}overview`, { session_id });
    }

    public static async exportMonthly(session_id?: number) {
        return Api(`${this.endpoint}export-purchase`, { session_id }, {
            download: true
        });
    }

    public static async sessionWiseReports(session_id?: number) {
        return Api(`${this.endpoint}export-session-wise`,{session_id}, {
            download: true
        });
    }



}