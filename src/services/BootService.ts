import Api from '@/lib/api';

export class BootService {
    public static async boot() {
        return Api('boot');
    }
}