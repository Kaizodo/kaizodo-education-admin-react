import Api from '@/lib/api';


export class PosService {

    private static endpoint = 'pos';


    public static async download(form: any) {
        return Api(`${this.endpoint}/purchase-order-download`, form, {
            responseType: 'blob',
            download: true
        });
    }


    public static async dashboard(form: any) {
        return Api(`${this.endpoint}/dashboard`, form);
    }

    public static async searchInvoices(form: any) {
        return Api(`${this.endpoint}/search-invoices`, form);
    }

    public static async startSession(form: any) {
        return Api(`${this.endpoint}/start-session`, form);
    }

    public static async closeSession(form: any) {
        return Api(`${this.endpoint}/close-session`, form);
    }

    public static async generateInvoice(form: any) {
        return Api(`${this.endpoint}/generate-invoice`, form);
    }

    public static async detail(form: {
        internal_reference_number: string,
        organization_id: number
    }) {
        return Api(`${this.endpoint}/detail`, form);
    }

    public static async deleteInvoice(form: {
        internal_reference_number: string,
        organization_id: number
    }) {
        return Api(`${this.endpoint}/delete-invoice`, form);
    }



    public static async searchProductOnDemand(form: any) {
        return Api(`${this.endpoint}/search-product-on-demand`, form);
    }

    public static async createPurchaseOrder(form: any) {
        return Api(`${this.endpoint}/create-purchase-order`, form);
    }

    public static async searchPurchaseOrders(form: any) {
        return Api(`${this.endpoint}/search-purchase-orders`, form);
    }


    public static async purchaseOrderDetail(form: any) {
        return Api(`${this.endpoint}/purchase-order-detail`, form);
    }

    public static async purchaseOrderReceive(form: any) {
        return Api(`${this.endpoint}/purchase-order-receive`, form);
    }
}