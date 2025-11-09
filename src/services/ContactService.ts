import Api from '@/lib/api';


export class ContactService {

    private static endpoint = 'contact';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }
    
    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }



}