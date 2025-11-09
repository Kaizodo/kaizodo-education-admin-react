import Api from '@/lib/api';


export class HomeworkReportService {

  private static endpoint = 'homework-reports/';

  public static async homeworkStudentReports(form: any) {
    return Api(`${this.endpoint}student-homework-reports`, form);
  }
  
  public static async homeworkStudentReportsExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}student-homework-reports`, form, {
      download: true
    });
  } 


  public static async studentList(form: any)
  {
    return Api(`${this.endpoint}student-list`,form);
  }

}