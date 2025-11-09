import { Card, CardContent } from "@/components/ui/card";
import { FaUserGraduate, FaArrowRight, FaSignOutAlt } from "react-icons/fa";

const cardStyle = "bg-white shadow-md rounded-lg p-3 w-full ";
const labelStyle = "text-xs text-gray-500";
const valueStyle = "text-sm font-medium text-gray-800";

type StudentAdmissionCardProps = {
    date: string;
    className: string;
    section: string;
    rollNo: string | number;
};

type StudentPromotionCardProps = {
    fromClass: string;
    toClass: string;
    fromRollNo: string | number;
    toRollNo: string | number;
    date: string;
};

type StudentExitCardProps = {
    date: string;
    className: string;
};

const StudentAdmissionCard = ({ date, className, section, rollNo }: StudentAdmissionCardProps) => (
    <Card className={cardStyle}>
        <CardContent className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
                <FaUserGraduate className="text-sm" />
                <h2 className="text-sm font-semibold">Admission Details</h2>
            </div>
            <div>
                <p className={labelStyle}>Admission Date</p>
                <p className={valueStyle}>{date}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <p className={labelStyle}>Class</p>
                    <p className={valueStyle}>{className}</p>
                </div>
                <div>
                    <p className={labelStyle}>Section</p>
                    <p className={valueStyle}>{section}</p>
                </div>
                <div>
                    <p className={labelStyle}>Roll No</p>
                    <p className={valueStyle}>{rollNo}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const StudentPromotionCard = ({ fromClass, toClass, fromRollNo, toRollNo, date }: StudentPromotionCardProps) => (
    <Card className={cardStyle}>
        <CardContent className="space-y-1">
            <div className="flex items-center gap-2 text-green-600">
                <FaArrowRight className="text-sm" />
                <h2 className="text-sm font-semibold">Promotion</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <p className={labelStyle}>From</p>
                    <p className={valueStyle}>{fromClass}</p>
                </div>
                <div>
                    <p className={labelStyle}>To</p>
                    <p className={valueStyle}>{toClass}</p>
                </div>
                <div>
                    <p className={labelStyle}>Date</p>
                    <p className={valueStyle}>{date}</p>
                </div>
                <div>
                    <p className={labelStyle}>Old Roll</p>
                    <p className={valueStyle}>{fromRollNo}</p>
                </div>
                <div>
                    <p className={labelStyle}>New Roll</p>
                    <p className={valueStyle}>{toRollNo}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const StudentExitCard = ({ date, className }: StudentExitCardProps) => (
    <Card className={cardStyle}>
        <CardContent className="space-y-1">
            <div className="flex items-center gap-2 text-red-600">
                <FaSignOutAlt className="text-sm" />
                <h2 className="text-sm font-semibold">Exit</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <p className={labelStyle}>Exit Date</p>
                    <p className={valueStyle}>{date}</p>
                </div>
                <div>
                    <p className={labelStyle}>Last Class</p>
                    <p className={valueStyle}>{className}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export { StudentAdmissionCard, StudentPromotionCard, StudentExitCard };
