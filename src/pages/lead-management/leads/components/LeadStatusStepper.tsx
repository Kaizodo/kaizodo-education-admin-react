import { LeadStatus, LeadStatusArray } from "@/data/Lead";


export default function StepBar({ status, size = "lg" }: { size?: "sm" | "lg", status: LeadStatus }) {
  return (
    <div className="flex w-full overflow-hidden">
      {LeadStatusArray.map((s, i) => {
        const active = s.id === status;

        return (
          <div key={i} className="flex-1 min-w-0 flex items-center group">
            <div
              className={`
                w-full flex items-center gap-2 justify-center
                ${size === "sm" ? "px-2 py-1 text-xs" : "px-6 py-2 text-sm"} font-medium
                ${active ? "bg-teal-300 text-black" : "bg-gray-200 text-gray-600"}
                relative
                transition-all
                overflow-hidden
              `}
              style={{
                borderRadius:
                  i === 0
                    ? "9999px 0 0 9999px"
                    : i === LeadStatusArray.length - 1
                      ? "0 9999px 9999px 0"
                      : "0",
                clipPath:
                  i === 0
                    ? "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)"
                    : i === LeadStatusArray.length - 1
                      ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 5% 50%)"
                      : "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%)",
              }}
            >
              <span
                className={`
                  ${active ? "whitespace-nowrap" : "truncate"}
                  group-hover:whitespace-nowrap
                  group-hover:overflow-visible
                  group-hover:bg-inherit
                  transition-all
                `}
              >
                {s.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}