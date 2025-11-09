import Api from '@/lib/api';


export class StudentReportService {

    private static endpoint = 'student-reports/';

    public static async admissionRegister(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}admission-register`, form);
    }

    public static async strengthReport() {
        return Api(`${this.endpoint}strenght-report`);
    }

    public static async strengthReportExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}strenght-report`, form, {
            download: true
        });
    }


    public static async transferBonafied(form: any) {
        return Api(`${this.endpoint}transfer-bonafied`, form);
    }

    public static async transferBonafiedExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}transfer-bonafied`, form, {
            download: true
        });
    }


    public static async studentReports(form: any) {
        return Api(`${this.endpoint}list`, form);
    }

    public static async studentReportsExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}list`, form, {
            download: true
        });
    }


    public static async classSectionReports(form: any) {
        return Api(`${this.endpoint}class-section`, form);
    }

    public static async classSectionReportsExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}class-section`, form, {
            download: true
        });
    }

    public static async studentHistory(form: any) {
        return Api(`${this.endpoint}student-history`, form);
    }

    public static async siblingReports(form: any) {
        return Api(`${this.endpoint}siblings`, form);
    }

    public static async studentProfile(form: any) {
        return Api(`${this.endpoint}student-profile`, form);
    }

    public static async studentProfileExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}student-profile`, form, {
            download: true
        });
    }

}