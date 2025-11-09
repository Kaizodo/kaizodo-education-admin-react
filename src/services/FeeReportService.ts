import Api from '@/lib/api';


export class FeeReportService {

    private static endpoint = 'fee-reports/';

    public static async studentStatement(form: any) {
        return Api(`${this.endpoint}student-fee-statement`, form);
    }

    public static async studentStatementExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}student-fee-statement`, form, {
            download: true
        });
    }

    public static async balanceFee(form: any) {
        return Api(`${this.endpoint}balance-fees-reports`, form);
    }

    public static async balanceFeeExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}balance-fees-reports`, form, {
            download: true
        });
    }

}