import Api from '@/lib/api';


export class SalaryReportService {

    private static endpoint = 'salary-report/';

    public static async salaryReports(session_id?: number) {
        return Api(`${this.endpoint}overview`, { session_id });
    }

    public static async exportTopSalaryEmployee(session_id?: number) {
        return Api(`${this.endpoint}export-top-highest-salary`, { session_id }, {
            download: true
        });
    }

    public static async exportRoleWiseSalary(session_id?: number) {
        return Api(`${this.endpoint}export-role-wise-salary`, { session_id }, {
            download: true
        });
    }


    public static async exportDeductionReports(session_id?: number) {
        return Api(`${this.endpoint}export-deduction-report`, { session_id }, {
            download: true
        });
    }


    public static async exportMonthlySalaryPayment(session_id?: number) {
        return Api(`${this.endpoint}export-monthly-salary-payment`, { session_id }, {
            download: true
        });
    }


    public static async exportSessionSummary(session_id?: number) {
        return Api(`${this.endpoint}export-session-summary`, { session_id }, {
            download: true
        });
    }








}