import Api from "@/lib/api";

export class VendorReportService {

    private static endpoint = 'vendor-report/';

    public static async vendorReports(session_id: number) {
        return Api(`${this.endpoint}statistics`, { session_id });
    }

    public static async exportVendorPurchaseVolume(session_id?: number) {
        return Api(`${this.endpoint}export-vendor-purchase-volume`, { session_id }, {
            download: true
        });
    }

    public static async exportTopVendorsBySpend(session_id?: number) {
        return Api(`${this.endpoint}export-top-vendors-by-spend`, { session_id }, {
            download: true
        });
    }


    public static async exportVendorContribution(session_id?: number) {
        return Api(`${this.endpoint}export-vendor-contribution`, { session_id }, {
            download: true
        });
    }


    public static async exportMonthlyPurchasesByVendor(session_id?: number) {
        return Api(`${this.endpoint}export-monthly-purchases-by-vendor`, { session_id }, {
            download: true
        });
    }

    public static async exportVendorItemSupply(session_id?: number) {
        return Api(`${this.endpoint}export-vendor-item-supply`, { session_id }, {
            download: true
        });
    }


}