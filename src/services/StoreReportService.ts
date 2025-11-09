import Api from "@/lib/api";

export class StoreReportService {

    private static endpoint = "store-report/";

    public static async storeReports(session_id?: number, transaction_type?: number, store_id?: number) {
        return Api(`store-report/statistics`, { session_id, transaction_type, store_id });
    }


    public static async exportSales(session_id?: number) {
        return Api(`${this.endpoint}export-sales`, { session_id }, {
            download: true
        });
    }

     public static async exportStoreContribution(session_id?: number) {
        return Api(`${this.endpoint}export-contribution`, { session_id }, {
            download: true
        });
    }


     public static async exportRevenueTrend(session_id?: number) {
        return Api(`${this.endpoint}export-revenue-trend`, { session_id }, {
            download: true
        });
    }


     public static async exportTermGrowth(session_id?: number) {
        return Api(`${this.endpoint}export-term-growth`, { session_id }, {
            download: true
        });
    }

     public static async exportLastYearsPerformance() {
        return Api(`${this.endpoint}export-five-years-performance`, { }, {
            download: true
        });
    }


}