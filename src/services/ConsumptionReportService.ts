
import Api from '@/lib/api';


export class ConsumptionReportService {

    private static endpoint = 'procurement-report/';

    public static async consumeptionReports(session_id?: number) {
        return Api(`${this.endpoint}consumable-items`, { session_id });
    }

    public static async exportMostBoughtItems(session_id?: number) {
        return Api(`${this.endpoint}export-most-bought-items`, { session_id }, {
            download: true
        });
    }


    public static async exportMostDemandedItems(session_id?: number) {
        return Api(`${this.endpoint}export-most-demanded-items`, { session_id }, {
            download: true
        });
    }


    public static async exportPurchaseAmountTrend(session_id?: number) {
        return Api(`${this.endpoint}export-purchase-amount-trend`, { session_id }, {
            download: true
        });
    }

    public static async exportFiveYearPurchases(session_id?: number) {
        return Api(`${this.endpoint}export-five-year-purchases`, { session_id }, {
            download: true
        });
    }


    public static async exportMostConsumedItems() {
        return Api(`${this.endpoint}export-most-consumed-items`, {}, {
            download: true
        });
    }



}