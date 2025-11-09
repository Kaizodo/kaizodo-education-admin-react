import Api from '@/lib/api';


export class ClassReportService {

    private static endpoint = 'class-report/';

    public static async subjectPerformance(session_id?: number, subject_id?: number) {
        return Api(`${this.endpoint}overview`, { session_id, subject_id });
    }


    public static async subjectPerformanceExport(session_id?: number, subject_id?: number) {
        return Api(`${this.endpoint}export-subject-performance`, { session_id, subject_id }, {
            download: true
        });
    }

    public static async passFailRatioExport(session_id?: number) {
        return Api(`${this.endpoint}export-pass-fail-ratio`, { session_id }, {
            download: true
        });
    }

    public static async sessionComprisonExport(session_id?: number) {
        return Api(`${this.endpoint}session-comparison-class`, { session_id }, {
            download: true
        });
    }

    public static async genderPerformanceExport(session_id?: number) {
        return Api(`${this.endpoint}export-gender-wise-performance`, { session_id }, {
            download: true
        });
    }

       public static async topAveragePerformanceExport(session_id?: number) {
        return Api(`${this.endpoint}export-top-average-lower-performance`, { session_id }, {
            download: true
        });
    }

    

    
}