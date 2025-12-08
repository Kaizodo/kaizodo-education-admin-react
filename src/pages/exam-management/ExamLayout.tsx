import CommonLayout from "@/components/app/CommonLayout";
import { ExamNavs } from "./ExamNavs";

export default function ExamLayout() {
    return (<CommonLayout title="Exam Mgmt" navs={ExamNavs} route_root="/exam-management" />)
}
