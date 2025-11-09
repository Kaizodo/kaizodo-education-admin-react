import Api from '@/lib/api';


export class EmployeeLeaveReportService {

    private static endpoint = 'employee-leave-report/';

    public static async overviewLeave(session_id?: number, month?: number, period_type?: string) {
        return Api(`${this.endpoint}overview`, { session_id, month, period_type });
    }

    public static async exportPendingLeaves(session_id?: number) {
        return Api(`${this.endpoint}export-pending-leaves`, { session_id }, {
            download: true
        });
    }


    public static async exportPeriodLeave(session_id?: number, period_type?: string) {
        return Api(`${this.endpoint}export-period-leaves`, { session_id, period_type }, {
            download: true
        });
    }


    public static async exportPieChart(session_id?: number) {
        return Api(`${this.endpoint}export-pie-chart-leave-type`, { session_id }, {
            download: true
        });
    }


    public static async exportComparison(session_id?: number) {
        return Api(`${this.endpoint}export-previous-current-comprison`, { session_id }, {
            download: true
        });
    }


    public static async exportLeaveTaken(session_id?: number) {
        return Api(`${this.endpoint}export-leave-taken`, { session_id }, {
            download: true
        });
    }

    public static async exportLeaveTypeComparison(session_id?: number) {
        return Api(`${this.endpoint}leave-type-comparison`, { session_id }, {
            download: true
        });
    }


    public static async export5YearTrend() {
        return Api(`${this.endpoint}leave-trend-five-sessions`, { }, {
            download: true
        });
    }

}