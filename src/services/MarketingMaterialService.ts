import Api from '@/lib/api';


export class MarketingMaterialService {

    private static endpoint = 'marketing-material';


    public static async search(form: any) {
        return Api(`${this.endpoint}/search`, form);
    }



    public static async upload(form: any, onUploadProgress: (p: number) => void) {
        return Api(`${this.endpoint}/upload`, form, {
            onUploadProgress
        });
    }


    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }



}