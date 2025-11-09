import Api from '@/lib/api';


export class TransportReportsService {

    private static endpoint = 'transport-reports/';

    public static async vehicleReports(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}vehicle-reports`, form);
    }

    public static async studentTransport(form: any) {
        return Api(`${this.endpoint}student-reports`,form);
    }




}