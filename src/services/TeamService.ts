import Api from '@/lib/api';

export class TeamService {
    private static endpoint = 'team';

    public static async search(form: {
        page: number,
        keyword: string
    }) {
        return Api(`${this.endpoint}/search`, form);
    }

    public static async create(form: any) {
        return Api(`${this.endpoint}/create`, form);
    }

    public static async update(form: any) {
        return Api(`${this.endpoint}/update`, form);
    }

    public static async detail(id: number) {
        return Api(`${this.endpoint}/detail`, { id });
    }

    public static async delete(id: number) {
        return Api(`${this.endpoint}/delete`, { id });
    }

    public static async saveTicketConfiguration(form: any) {
        return Api(`${this.endpoint}/save-ticket-configuration`, form);
    }

    public static async loadTicketConfiguration(team_id: number) {
        return Api(`${this.endpoint}/load-ticket-configuration`, { team_id });
    }

}