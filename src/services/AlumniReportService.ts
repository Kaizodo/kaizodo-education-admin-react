import Api from '@/lib/api';


export class AlumniReports {

    private static endpoint = 'alumni-reports/';

    public static async studentPassOutReports(form: any) {
        return Api(`${this.endpoint}student-pass-out-reports`, form);
    }

    public static async studentPassOutReportsExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}student-pass-out-reports`, form, {
            download: true
        });
    }

}