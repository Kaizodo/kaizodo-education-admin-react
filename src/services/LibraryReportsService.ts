import Api from '@/lib/api';


export class LibraryReportsService {

    private static endpoint = 'library-reports/';

    public static async bookIssueReports(form: any) {
        return Api(`${this.endpoint}book-issue-reports`, form);
    }

    public static async bookIssueReportsExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}book-issue-reports`, form, {
            download: true
        });
    }

    public static async bookDueReports(form: any) {
        return Api(`${this.endpoint}book-due-reports`, form);
    }

    public static async bookDueReportsExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}book-due-reports`, form, {
            download: true
        });
    }

    public static async bookInventoryReports(form: any) {
        return Api(`${this.endpoint}book-inventory-reports`, form);
    }

    public static async bookInventoryReportsExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}book-inventory-reports`, form, {
            download: true
        });
    }

    public static async bookReturnReports(form: any) {
        return Api(`${this.endpoint}book-return-reports`, form);
    }


    public static async bookReturnReportsExport(form: { export?: boolean }) {
        return Api(`${this.endpoint}book-return-reports`, form, {
            download: true
        });
    }






}