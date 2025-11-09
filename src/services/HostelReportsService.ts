import Api from '@/lib/api';


export class HostelReportsService {

  private static endpoint = 'hostel-reports/';

  public static async hostelStudentReports(form: any) {
    return Api(`${this.endpoint}student-hostel-reports`, form);
  }
  
  public static async hostelStudentReportsExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}student-hostel-reports`, form, {
      download: true
    });
  } 

}