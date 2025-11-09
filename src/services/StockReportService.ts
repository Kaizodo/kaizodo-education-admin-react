import Api from "@/lib/api";

export class StockReportService {

    private static endpoint = 'stock-report/';

    public static async stockReports(session_id?: number, period?: string) {
        return Api(`${this.endpoint}statistics`, { session_id, period });
    }

    public static async lowStock(form: any){
      return Api(`low-stock/reports`,form);
    }

    public static async criticleStock(form: any){
      return Api(`criticle-stock/reports`,form);
    }

     public static async storeWiseLowStock(form: any){
      return Api(`store-low-stock/reports`, form);
    }

     public static async exportStoreWiseLowStock() {
        return Api(`store-low-stock/exports-reports`, {}, {
            download: true
        });
    }

    public static async exportCriticleStock() {
        return Api(`criticle-stock/exports-reports`, {}, {
            download: true
        });
    }

    public static async exportLowStock(form: any) {
        return Api(`low-stock/exports-reports`, form, {
            download: true
        });
    }

    public static async exportStockInflow(session_id?: number) {
        return Api(`${this.endpoint}export-in-flow`, { session_id }, {
            download: true
        });
    }

    public static async exportVendorWiseInflow(session_id?: number) {
        return Api(`${this.endpoint}export-vendor-wise-in-flow`, { session_id }, {
            download: true
        });
    }


    public static async exportItemCategoryInflow(session_id?: number) {
        return Api(`${this.endpoint}export-item-category-in-flow`, { session_id }, {
            download: true
        });
    }


    public static async exportTopItems(session_id?: number) {
        return Api(`${this.endpoint}export-top-items`, { session_id }, {
            download: true
        });
    }

    public static async exportSessionComparison(session_id?: number) {
        return Api(`${this.endpoint}export-session-comparison`, { session_id }, {
            download: true
        });
    }


}