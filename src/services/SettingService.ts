import Api from '@/lib/api';


export class SettingService {

    private static endpoint = 'settings';


    public static async getSettings() {
        return Api(`${this.endpoint}/get-settings`);
    }

    public static async setSettings(form: any) {
        return Api(`${this.endpoint}/set-settings`, form);
    }

    public static async saveNavigation(form: any) {
        return Api(`${this.endpoint}/save-navigation`, form);
    }

    public static async loadNavigation() {
        return Api(`${this.endpoint}/load-navigation`);
    }

}