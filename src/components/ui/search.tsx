
import * as React from "react";
import { Search as SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SearchProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative items-center  flex">
                <SearchIcon className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);

Search.displayName = "Search";

export { Search };
