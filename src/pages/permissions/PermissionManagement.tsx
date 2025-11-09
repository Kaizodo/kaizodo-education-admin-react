
import { lazy, Suspense, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, Copy, CopyCheck } from 'lucide-react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import AppCard from '@/components/app/AppCard';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Modal, ModalBody } from '@/components/common/Modal';
import { PermissionService } from '@/services/PermissionService';
import TextField from '@/components/common/TextField';
import Checkable from '@/components/common/Checkable';
import Note from '@/components/common/Note';
import { Label } from '@/components/ui/label';
import { LuWandSparkles } from 'react-icons/lu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuggestPermissionGroup from '@/components/common/suggest/SuggestPermissionGroup';
import { Panel } from '@/data/global';
import { Permission } from '@/data/Permissions';

const LazyEditorDalog = lazy(() => import('./components/PermissionEditorDialog'));

export default function PermissionManagement() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
        permission_group_id?: number
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });
    const [form, setForm] = useState<any>({
        name: '',
        panels: [
            Panel.Admin,
            Panel.Employee
        ],
        crud: [
            'Create',
            'Update',
            'Search',
            'Delete',
            'Detail'
        ]
    });
    const setValue = useSetValue(setForm);

    const setFilter = useSetValue(setFilters);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await PermissionService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }


    function CodeBox({ code }: { code: string }) {
        const [copied, setCopied] = useState(false);

        const handleCopy = async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000); // reset after 2s
        };

        return (
            <div className="relative">
                <Btn
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <CopyCheck className="w-4 h-4" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </Btn>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-[60vh]">
                    <code>{code}</code>
                </pre>
            </div>
        );
    }


    const generateEnum = async () => {
        setGenerating(true);
        var r = await PermissionService.generateEnum();
        if (r.success) {
            Modal.show({
                title: 'Enum Codes',
                maxWidth: 700,
                content: () => {

                    return <>
                        <ModalBody>
                            <Tabs defaultValue="php" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="php">PHP</TabsTrigger>
                                    <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                                </TabsList>

                                <TabsContent value="php">
                                    <CodeBox code={r.data.php} />
                                </TabsContent>

                                <TabsContent value="typescript">
                                    <CodeBox code={r.data.typescript} />
                                </TabsContent>
                            </Tabs>
                        </ModalBody>

                    </>
                }
            })
        }
        setGenerating(false);
    }

    const save = async () => {
        if (form.name && form.crud) {
            if (form.crud.length > 0) {
                setSaving(true);
                var r = await PermissionService.create(form);
                if (r.success) {
                    msg.success('Crud created successfuly');
                    search();
                }
                setSaving(false);
            }
        }
    }

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);

    const openEditor = async (id?: number) => {
        const modal_id = Modal.show({
            title: id ? 'Edit Permission' : 'Add Permission',
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDalog id={id} onSuccess={() => {
                    search();
                    Modal.close(modal_id);
                }} onCancel={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }


    function getPermissionEnumTs(name: string): string {
        const pascal = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join('');
        return `Permissions.${pascal}`;
    }

    function getPermissionEnumPhp(name: string): string {
        const pascal = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join('');
        return `PermissionsEnum::${pascal}->value`;
    }

    function CodeCell({ text }: { text: string }) {
        const handleClick = async () => {
            await navigator.clipboard.writeText(text);
            msg.success('Coppied to clipboard');
        };

        return (
            <pre
                onClick={handleClick}
                style={{
                    cursor: 'pointer',
                    background: '#f5f5f5',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    userSelect: 'all',
                }}
            >
                <code>{text}</code>
            </pre>
        );
    }

    function toPascalCase(str: string): string {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join('');
    }

    function generatePhpEnumEntries(name: string, actions: string[]): string {
        const pascal = toPascalCase(name);
        return actions
            .map((action, i) => `    case ${action}${pascal} = ${(paginated.records?.[0]?.id ?? 1) + i + 1};`)
            .join('\n');
    }

    function generateTsEnumEntries(name: string, actions: string[]): string {
        const pascal = toPascalCase(name);
        return actions
            .map((action, i) => `  ${action}${pascal} = ${(paginated.records?.[0]?.id ?? 1) + i + 1},`)
            .join('\n');
    }

    return (
        <AppPage title="Platform Permissions" subtitle="Manage permissions used to control access to website sections and APIs" >
            <AppCard title='Crud Operation'>

                <div className='px-6 pb-6 grid grid-cols-2 gap-3'>
                    <div className='space-y-3 border p-3 rounded-lg'>
                        <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                        <TextField value={form.description} onChange={setValue('description')} multiline>Description</TextField>
                        <Checkable size={'sm'} value={form.crud} onChange={setValue('crud')} options={[
                            { id: Permission.ENABLE, name: 'Enable' },
                            { id: Permission.CREATE, name: 'Create' },
                            { id: Permission.UPDATE, name: 'Update' },
                            { id: Permission.READ, name: 'Read' },
                            { id: Permission.DELETE, name: 'Delete' }
                        ]}>Permission Type</Checkable>
                        <SuggestPermissionGroup value={form.permission_group_id} onChange={setValue('permission_group_id')} />

                        <Btn size={'sm'} onClick={save} loading={saving}><Save />Create Permission</Btn>
                    </div>
                    <div>
                        <Note subtitle='Cross check enum values carefully as values may very' />

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>PHP Enum</Label>
                                <CodeCell text={generatePhpEnumEntries(form.name, form.crud)} />
                            </div>
                            <div>
                                <Label>Typescript Enum</Label>
                                <CodeCell text={generateTsEnumEntries(form.name, form.crud)} />
                            </div>
                        </div>
                    </div>
                </div>
            </AppCard>
            <AppCard title='Permissions' actions={<div className='me-4 flex flex-row items-center gap-3'>
                <Btn size={'sm'} onClick={() => openEditor()}><FaPlus />Add New</Btn>
                <Btn size={'sm'} variant={'destructive'} onClick={generateEnum} loading={generating}><LuWandSparkles />Generate All Enums</Btn>
            </div>}>
                <div className="grid grid-cols-2 px-6 gap-6">
                    <TextField value={filters.keyword} onChange={setFilter('keyword')}>Keyword</TextField>
                    <SuggestPermissionGroup value={filters.permission_group_id} onChange={setFilter('permission_group_id')} />
                </div>
                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Php Enum</TableHead>
                                <TableHead>Typescript Enum</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.id}</TableCell>
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>{record.description}</TableCell>
                                    <TableCell>{record.permission_group_name}</TableCell>
                                    <TableCell>
                                        <CodeCell text={getPermissionEnumPhp(record.name)} />
                                    </TableCell>
                                    <TableCell>
                                        <CodeCell text={getPermissionEnumTs(record.name)} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}
                    {!searching && paginated.records.length == 0 && <NoRecords />}
                    <div className='p-3'>
                        <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />

                    </div>
                </div>
            </AppCard>
        </AppPage>
    );
};

