import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { LuCheck, LuChevronsUpDown, LuLoader, LuX } from "react-icons/lu";


import { cn, nameLetter } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IconType } from "react-icons/lib";

export type DropdownItemType = {
    id: any,
    name: string,
    description?: string,
    image?: string,
    icon?: IconType,
    data?: any,
    widget?: (data: DropdownItemType) => React.ReactNode
};

type Props = {
    value?: any,
    onChange: (value?: any) => void,
    selected?: DropdownItemType,
    placeholder?: string,
    children?: string,
    includedValues?: (undefined | number | string)[],
    searchable?: boolean,
    disabled?: boolean,
    footer?: (callback: (item: DropdownItemType) => void) => React.ReactNode,
    onSelect?: (output: any) => void,
    getOptions: ({ keyword, page, ids }: { keyword: string, page: number, ids: number[] }) => Promise<DropdownItemType[]>
};

export default function Dropdown({ value, includedValues = [undefined], selected, onChange, onSelect, children, placeholder, searchable = true, disabled, getOptions, footer }: Props) {
    const [open, setOpen] = useState(false)
    const [searching, setSearching] = useState(false);
    const [records, setRecords] = useState<DropdownItemType[]>([]);
    const [initilized, setInitilized] = useState(false);
    useEffect(() => {
        if (includedValues.includes(value) || Number(value) > 0 && !initilized) {
            if (!selected) {
                search('', [Number(value)]);
            }
        } else {
            setInitilized(true);
        }
    }, [value]);

    useEffect(() => {
        if (selected && !records.find(r => r.id == selected.id)) {
            if (!!selected?.name && selected?.id !== undefined) {
                setRecords(r => [...r, selected]);
            }
        }

    }, [selected])

    const debounce = useDebounce((keyword: string) => {
        search(keyword);
    }, 300);

    const search = async (keyword: string = '', ids: number[] = []) => {
        if (searching) {
            return;
        }
        setSearching(true);
        var latestRecords = await getOptions({ keyword: keyword, page: 1, ids: ids });
        if (selected?.name) {
            latestRecords = [...latestRecords.filter(s => s.id !== selected.id), selected];
        }
        setRecords(latestRecords);
        if (initilized) {

        }
        setInitilized(true);
        setSearching(false);
    }


    var found = records.find(r => r.id === value);





    return (

        <div className="space-y-2">
            {!!children && <Label className="mb-1">{children}</Label>}
            <Popover
                open={open}
                onOpenChange={(bool) => {
                    if (bool) {
                        search('');
                    }
                    setOpen(bool);
                }}

            >
                <PopoverTrigger asChild>
                    <Button
                        disabled={disabled}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[100%]  items-center font-normal"
                    >
                        {found && found?.image && <Avatar className="h-6 w-6">
                            <AvatarImage src={found?.image} />
                            <AvatarFallback>{nameLetter(found?.name)}</AvatarFallback>
                        </Avatar>}
                        {found && !!found.icon && <found.icon className="h-4 w-4 " />}
                        <span className="flex-1 text-start">{found ? found.name : placeholder}</span>
                        <LuChevronsUpDown className="opacity-50" />
                        {found && <div className="h-full  items-center flex " onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChange(undefined);
                            setOpen(false)
                        }}>
                            <LuX />
                        </div>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0 pointer-events-auto z-[999]">
                    <Command shouldFilter={false}>
                        {searchable && <CommandInput placeholder="Search..." onValueChange={debounce} />}
                        <CommandList>
                            <CommandEmpty>No records found.</CommandEmpty>
                            <CommandGroup>
                                {searching && <CommandItem>
                                    <div className="h-[100px] w-[100%] flex items-center justify-center">
                                        <LuLoader className="animate-spin" />
                                    </div>
                                </CommandItem>}
                                {!searching && records.map((record) => (
                                    <CommandItem
                                        key={record.id}
                                        value={`${record.id}`}
                                        onSelect={() => {
                                            if (onSelect) {
                                                var { widget, ...rest } = record;
                                                onSelect(rest);
                                            }
                                            onChange(record.id);
                                            setOpen(false)
                                        }}
                                        asChild={!!record.widget}
                                    >
                                        {!!record.widget ? record.widget(record) : <>
                                            {!!record.icon && <record.icon className="h-4 w-4 me-2" />}
                                            {!record.widget && record?.image && <Avatar className="h-6 w-6 me-2">
                                                <AvatarImage src={record?.image} />
                                                <AvatarFallback>{nameLetter(record?.name)}</AvatarFallback>
                                            </Avatar>}
                                            <div className="flex flex-col">
                                                <span>{record.name}</span>
                                                <span className="text-[10px] leading-none text-gray-600 font-normal">{record.description}</span>
                                            </div>
                                            <LuCheck
                                                className={cn(
                                                    "ml-auto",
                                                    value === record.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </>}
                                    </CommandItem>
                                ))}
                            </CommandGroup>

                        </CommandList>
                        {!!footer && <div className="border border-e-0 border-s-0 border-b-0 p-2" onClick={() => {
                            setOpen(false);
                        }}>
                            {footer((item) => {
                                setRecords(ps => [...ps, item]);

                                if (onSelect) {
                                    onSelect(item);
                                }
                                onChange(item.id);
                                setOpen(false)
                            })}
                        </div>}
                    </Command>
                </PopoverContent>
            </Popover>



        </div>
    );
}