import Api from '@/lib/api';


export class FinanceReportService {

    private static endpoint = 'finance-reports/';

    public static async exploreReports(session_id?: number) {
        return Api(`${this.endpoint}overview`, { session_id });
    }

    public static async exportFeesCombined(session_id?: number) {
        return Api(`${this.endpoint}export-fees-combined`, { session_id }, {
            download: true
        });
    }

    public static async exportSalariesCombined(session_id?: number) {
        return Api(`${this.endpoint}export-salaries-combined`, { session_id }, {
            download: true
        });
    }

    public static async exportPurchasesCombined(session_id?: number) {
        return Api(`${this.endpoint}export-purchase-combined`, { session_id }, {
            download: true
        });
    }

    public static async exportSessionBalanceSheet(session_id?: number) {
        return Api(`${this.endpoint}export-session-balance-sheet`, { session_id }, {
            download: true
        });
    }

    public static async exportYearsFinanceHealth(session_id?: number) {
        return Api(`${this.endpoint}export-years-finanace`, { session_id }, {
            download: true
        });
    }





}