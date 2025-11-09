import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LuChevronsLeftRightEllipsis } from "react-icons/lu";
import { useState } from "react";
import { PaginationType } from "@/data/pagination";
import Btn from "./Btn";
import { ClassValue } from "clsx";
type Props = {
    searching?: boolean,
    paginated: PaginationType<any>,
    onChange: (page: number) => void,
    showCount?: boolean,
    className?: ClassValue,
    range?: number
}

export default function Pagination({ searching, paginated, onChange, showCount = true, className, range = 3 }: Props) {

    const [page, setPage] = useState(paginated.page);


    const getArray = (n: number) => Array.from({ length: n });

    const getRange = (): number[] => {
        if (!paginated) {
            return [];
        }
        var items: number[] = [];
        let start = Math.max(1, paginated.page - range);
        let end = Math.min(paginated.pages, paginated.page + range);

        if (end - start < 2 * range) {
            if (start === 1) {
                end = Math.min(paginated.pages, start + 2 * range);
            } else {
                start = Math.max(1, end - 2 * range);
            }
        }

        for (let i = start; i <= end; i++) {
            items.push(i);
        }

        return items;
    }

    const onPageSelect = (pageNumber: number): void => {
        setPage(pageNumber);
        if (!paginated) {
            return;
        }

        if (pageNumber < 1 || pageNumber > paginated.pages) {
            return;
        }
        onChange(pageNumber);
    }

    return (
        paginated.pages > 1 ? <div className={"flex flex-row items-center gap-2 " + className}>
            {!!showCount && <span className="hidden md:inline-block">Showing {paginated.records.length * paginated.page} / {paginated.total} records</span>}
            {paginated.page > 2 && <Btn size={'sm'} variant={'outline'} onClick={() => onPageSelect(1)}><FaAnglesLeft /></Btn>}
            {paginated.page > 1 && <Btn size={'sm'} variant={'outline'} onClick={() => onPageSelect(paginated.page - 1)}><FaAngleLeft /></Btn>}
            {getRange().map((p) => <Btn size={'sm'} key={'p_' + p} variant={p == paginated.page ? 'default' : 'outline'} loading={searching && page == p} onClick={() => onPageSelect(p)}>{p}</Btn>)}
            {paginated.pages > 7 && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="inline-block">
                        <Btn size={'sm'} variant={'outline'} loading={searching}><LuChevronsLeftRightEllipsis /></Btn>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Pagesx - {getArray(paginated.pages).length}</DropdownMenuLabel>
                    {getArray(paginated.pages).map((_p, pi) => <DropdownMenuItem key={'pdi_' + pi} onClick={() => onPageSelect(pi + 1)}>{pi + 1}</DropdownMenuItem>)}
                </DropdownMenuContent>
            </DropdownMenu>}
            {paginated.page < paginated.pages && <Btn size={'sm'} variant={'outline'} className="px-2" onClick={() => onPageSelect(paginated.page + 1)}><FaAngleRight /></Btn>}
            {paginated.page < paginated.pages - 1 && <Btn size={'sm'} variant={'outline'} onClick={() => onPageSelect(paginated.pages)}><FaAnglesRight /></Btn>}

        </div> : null
    )
}
