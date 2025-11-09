import { Api } from "@/lib/api";

export class UserOrderService {


    public static async search(form: any) {
        return Api('orders/search', form);
    }

    public static async detail(internal_reference_number: string) {
        return Api('orders/detail', { internal_reference_number });
    }

    public static async assignDeploymentManager(form: any) {
        return Api('orders/assign-deployment-manager', form);
    }

    public static async assignTeam(form: any) {
        return Api('orders/assign-team', form);
    }


    public static async invoice(internal_reference_number: string) {
        return Api('orders/invoice', { internal_reference_number }, {
            responseType: 'blob',
            download: true
        });
    }

}