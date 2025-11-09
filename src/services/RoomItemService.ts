import Api from "@/lib/api";

export class RoomItemService {

    private static endpoint = 'hostel-room-item/';

    public static async search (form: any){
        return Api(`${this.endpoint}search`,form);
    }

    public static async assign (form: any){
        return Api(`${this.endpoint}assign`,form);
    }

}