import Api from '@/lib/api';


export class InventoryReportsService {

  private static endpoint = 'inventory-reports/';

  public static async stockReports(form: any) {
    return Api(`${this.endpoint}stock-report`, form);
  }
  
  public static async stockReportsExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}stock-report`, form, {
      download: true
    });
  } 

  public static async issueItemReports(form: any) {
    return Api(`${this.endpoint}issue-items-reports`, form);
  }

  public static async issueItemReportsExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}issue-items-reports`, form, {
      download: true
    });
  }

  public static async addItemReports(form: any) {
    return Api(`${this.endpoint}add-items-reports`,form);
  }

  public static async addItemReportsExport(form: { export?: boolean }) {
    return Api(`${this.endpoint}add-items-reports`, form, {
      download: true
    });
  }





}