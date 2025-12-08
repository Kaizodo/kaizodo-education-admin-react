import { cn } from "@/lib/utils";

export default function ExamQuestionGroupQuestionNavigator({ questions, question_id, onSelect }: { questions: any[], question_id: number, onSelect: (question_id: number) => void }) {
    return (
        <div className="grid grid-cols-4 gap-2 p-4">
            {questions?.map?.((q, qi: number) => {
                let statusColor = "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"; // default pending

                if (!!q.is_completed) {
                    statusColor = "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
                }

                if (q.id === question_id) {
                    statusColor = "ring-2 ring-indigo-600 ring-offset-2 bg-indigo-50 text-indigo-700 border-indigo-200";
                }

                return (
                    <button
                        key={q.id}
                        onClick={() => onSelect(q.id)}
                        className={cn(
                            "h-10 w-full rounded-md flex items-center justify-center text-sm font-medium border transition-all",
                            statusColor,
                            !!q.is_completed && "ring-green-600 bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                        )}
                    >
                        {qi + 1}
                    </button>
                );
            })}
        </div>
    );
}