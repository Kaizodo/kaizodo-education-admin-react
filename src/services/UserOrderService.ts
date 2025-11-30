import { Api } from "@/lib/api";

export class UserOrderService {


    public static async stats() {
        return Api('orders/stats');
    }

    public static async search(form: any) {
        return Api('orders/search', form);
    }

    public static async detail(internal_reference_number: string) {
        return Api('orders/detail', { internal_reference_number });
    }

    public static async generateInvoice(form: any) {
        return Api('orders/generate-invoice', form);
    }

    public static async invoiceDetail(internal_reference_number: string) {
        return Api('orders/invoice-detail', { internal_reference_number });
    }

    public static async updateShipment(form: any) {
        return Api('orders/update-shipment', form);
    }


    public static async issueDetail(internal_reference_number: string) {
        return Api('orders/issue-detail', { internal_reference_number });
    }



    public static async shipmentDetail(internal_reference_number: string) {
        return Api('orders/shipment-detail', { internal_reference_number });
    }

    public static async assignDeploymentManager(form: any) {
        return Api('orders/assign-deployment-manager', form);
    }

    public static async assignRelationshipManager(form: any) {
        return Api('orders/assign-relationship-manager', form);
    }

    public static async assignTeam(form: any) {
        return Api('orders/assign-team', form);
    }


    public static async readyForShipment(form: any) {
        return Api('orders/ready-for-shipment', form);
    }

    public static async addTransitLocation(form: any) {
        return Api('orders/add-transit-location', form);
    }

    public static async outForDelivery(form: any) {
        return Api('orders/out-for-delivery', form);
    }

    public static async rescheduleDelivery(form: any) {
        return Api('orders/reschedule-delivery', form);
    }

    public static async cancelDelivery(form: any) {
        return Api('orders/cancel-delivery', form);
    }


    public static async cancelShipment(form: any) {
        return Api('orders/cancel-shipment', form);
    }

    public static async dispatch(form: any) {
        return Api('orders/dispatch', form);
    }

    public static async delivered(form: any) {
        return Api('orders/delivered', form);
    }

    public static async failedDeliveryItemsReturned(form: any) {
        return Api('orders/failed-delivery-items-return', form);
    }

    public static async updateOrderItemStatus(form: any) {
        return Api('orders/update-item-status', form);
    }


    public static async scheduleIssuePickup(form: any) {
        return Api('orders/schedule-issue-pickup', form);
    }

    public static async handleIssueApproval(form: any) {
        return Api('orders/handle-issue-approval', form);
    }

    public static async handleIssueReceivedItemStock(form: any) {
        return Api('orders/handle-issue-received-item-stock', form);
    }

    public static async downloadList(form: {
        internal_reference_number: string,
        organization_id: number
    }) {
        return Api('orders/download-list', form, {
            responseType: 'blob',
            download: true
        });
    }

    public static async invoice(internal_reference_number: string) {
        return Api('orders/invoice', { internal_reference_number }, {
            responseType: 'blob',
            download: true
        });
    }


    public static async printLables(form: any) {
        return Api(`orders/print-shipment-labels`, form, {
            responseType: 'blob'
        });
    }



    public static async searchShipments(form: any) {
        return Api('orders/shipment-search', form);
    }


    public static async searchOrderIssues(form: any) {
        return Api('orders/order-issue-search', form);
    }
}