import Api from "@/lib/api";

export class UserRoomService {

    private static endpoint = 'user-room/';

    public static async search(form: any) {
        return Api(`${this.endpoint}search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}create`, form);
    }

    public static async changeRoom(form: any) {
        return Api(`${this.endpoint}change`, form);
    }

    public static async changeRoomRequest(form: any) {
        return Api(`${this.endpoint}change-list`, form);
    }

    public static async stats() {
        return Api(`${this.endpoint}stats`);
    }

    public static async rejectChangeRequest(id: number, remarks: string) {
        return Api(`${this.endpoint}reject-request`, { id, remarks })
    }

    public static async approveRequest(id: number, remarks: string, hostel_room_id?: number | null) {
        const data: any = { id, remarks };

        if (hostel_room_id !== undefined) {
            data.hostel_room_id = hostel_room_id;
        }

        return Api(`${this.endpoint}approve-request`, data);
    }

    public static async detailsRequest(id: number){
        return Api(`${this.endpoint}change-details`,{id});
    }

}