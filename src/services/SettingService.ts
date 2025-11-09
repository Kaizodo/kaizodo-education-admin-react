import Api from '@/lib/api';


export class SettingService {

    private static endpoint = 'settings';


    public static async getSettings() {
        return Api(`${this.endpoint}/get-settings`);
    }

    public static async setSettings(form: any) {
        return Api(`${this.endpoint}/set-settings`, form);
    }

    public static async saveFooterLinks(form: any) {
        return Api(`${this.endpoint}/save-footer-links`, form);
    }

    public static async loadFooterLinks() {
        return Api(`${this.endpoint}/load-footer-links`);
    }

}