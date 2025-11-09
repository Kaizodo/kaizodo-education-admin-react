import Api from "@/lib/api";

export class FeeCollectionReportService {

    private static endpoint = 'fee-collection/';

    public static async feeReports(session_id?: number) {
        return Api(`${this.endpoint}overview`, { session_id });
    }

    public static async exportMonthlyCollectionTrends(session_id?: number) {
        return Api(`${this.endpoint}export-monthly-collection-trends`, { session_id }, {
            download: true
        });
    }

    public static async exportClassWiseCollections(session_id?: number) {
        return Api(`${this.endpoint}export-class-wise-collections`, { session_id }, {
            download: true
        });
    }


    public static async exportSessionWiseCollections(session_id?: number) {
        return Api(`${this.endpoint}export-session-wise-collections`, { session_id }, {
            download: true
        });
    }


    public static async exportTopClassesByCollection(session_id?: number) {
        return Api(`${this.endpoint}export-top-classes-by-collection`, { session_id }, {
            download: true
        });
    }

     public static async exportLateFee(session_id?: number) {
        return Api(`${this.endpoint}export-late-fees-monthly`, { session_id }, {
            download: true
        });
    }

    public static async exportMonthlyWaiver(session_id?: number){
        return Api(`${this.endpoint}export-monthly-waiver`, {session_id}, {
            download: true
        });
    }


}