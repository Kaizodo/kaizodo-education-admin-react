import Api from '@/lib/api';


export class InfirmaryReportService {

    private static endpoint = 'infirmary/';

    public static async getInfirmary(form: any) {
        return Api(`${this.endpoint}reports`, form);
    }






}