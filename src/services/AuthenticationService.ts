import Api, { ApiResponseType } from '@/lib/api';
import { Storage } from '@/lib/storage';

export class AuthenticationService {
    public static async isAuthenticated(): Promise<boolean> {
        const token = await Storage.get<string>('token');
        return !!token;
    }

    public static async logoutPlatform() {
        try {
            await Storage.clear();
        } catch (error) {
            console.error('Error clearing storage', error);
        }
        console.log('STORAGE CLEARED');
    }

    public static async logout() {
        await Api('logout');
        await this.logoutPlatform();
        window.location.href = '/login';

    }

    public static async login(form: {
        username: string;
        password: string;
    }) {
        return Api('login', form);
    }


    public static async handleSuccessAuthentication(response: ApiResponseType) {
        try {
            if (response.success) {
                await Storage.set<string>('token', response.data.token);
                window.location.href = '/app';
            } else {
                console.error('Authentication failed:', response);
            }
        } catch (error) {
            console.error('Error handling authentication:', error);
        }
    }
}