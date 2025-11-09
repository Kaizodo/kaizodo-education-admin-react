import Api from '@/lib/api';


export class ReportService {

    private static endpoint = 'student-report';

    public static async getTopPerformer(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}/top-performance`, { session_id, class_id });
    }

    public static async performanceOverview(session_id?: number, subject_id?: number, month?: string, user_id: number, exam_type?: number){
        return Api(`${this.endpoint}/performance-reports`, {session_id, subject_id, month, user_id, exam_type})
    }

    public static async getTopPerformerSession(form: any) {
        return Api(`${this.endpoint}/top-performance-session`, form);
    }

    public static async topperList(session_id?: number, class_id?: number){
        return Api(`${this.endpoint}/top-list`, { session_id, class_id },{
            download: true
        })
    }

    public static async topPerformerComparison(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}/top-performer-comparison`, { session_id, class_id },{
            download: true
        });
    }

    public static async yearlyReportExport(years?: number) {
        return Api(`${this.endpoint}/yearly-reports`, { years },{
            download: true
        });
    }

    public static async classWiseTopperExport(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}/class-wise-toppers`, { session_id, class_id },{
            download: true
        });
    }


    public static async classWisePerformanceExport(session_id?: number) {
        return Api(`${this.endpoint}/class-wise-performance`, { session_id },{
            download: true
        });
    }

    public static async genderWisePerformance(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}/gender-wise-performance`, { session_id, class_id },{
            download: true
        });
    }

    public static async topperByGender(session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}/topper-students-by-gender`, { session_id, class_id },{
            download: true
        });
    }

    public static async topperByYears(left_session_id?: number, right_session_id?: number, class_id?: number) {
        return Api(`${this.endpoint}/top-students-by-years`, { left_session_id, right_session_id, class_id },{
            download: true
        });
    }



    
    

}