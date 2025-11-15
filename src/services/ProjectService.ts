import { Api } from "@/lib/api";

export class ProjectService {


    public static async search(form: any) {
        return Api('project/search', form);
    }

    public static async detail(internal_reference_number: string) {
        return Api('project/detail', { internal_reference_number });
    }

    public static async assignDeploymentManager(form: any) {
        return Api('project/assign-deployment-manager', form);
    }

    public static async assignTeam(form: any) {
        return Api('project/assign-team', form);
    }

    public static async updatePhaseStep(form: any) {
        return Api('project/update-phase-step', form);
    }

    public static async startProjectDeployment(form: any) {
        return Api('project/start-project-deployment', form);
    }
    public static async finishProjectDeployment(form: any) {
        return Api('project/finish-project-deployment', form);
    }



    public static async invoice(internal_reference_number: string) {
        return Api('project/invoice', { internal_reference_number }, {
            responseType: 'blob',
            download: true
        });
    }

}