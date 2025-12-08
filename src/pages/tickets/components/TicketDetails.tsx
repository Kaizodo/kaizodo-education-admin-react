import { ReactNode, useEffect, useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { getTicketCategoryActionName, TicketPriorityArray, TicketState, TicketStatusArray } from '@/data/Ticket';
import TicketDetailSkeleton from './TicketDetailSkeleton';
import { TicketService } from '@/services/TicketService';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ClassValue } from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { nameLetter } from '@/lib/utils';
import moment from 'moment';
import { LuImage, LuPaperclip, LuSend, LuUserPlus } from 'react-icons/lu';
import Btn from '@/components/common/Btn';
import Richtext from '@/components/common/Richtext';
import { useGlobalContext } from '@/hooks/use-global-context';
import { useForm } from '@/hooks/use-form';



const Tag = ({ children, bgColor, textColor }: { children?: ReactNode, bgColor?: string, textColor?: string }) => (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor} mr-2`}>
        {children}
    </span>
);

const Card = ({ children, title, className = '' }: { children?: ReactNode, title?: string, className?: ClassValue }) => (
    <div className={`bg-white rounded-xl shadow-lg p-5 ${className}`}>
        {title && <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>}
        {children}
    </div>
);

const mockAttachments = [
    { name: 'doc.pdf', size: '28 KB', type: 'pdf' },
    { name: 'image.jpg', size: '30 KB', type: 'image' },
];

const ConversationDetails = ({ state }: { state: TicketState }) => {
    const { context } = useGlobalContext();
    const [form, setValue] = useForm();
    const is_member = !!state.users.find(u => u.id === context.user.id);
    var status = TicketStatusArray.find(s => s.id == state.ticket.status);
    var priority = TicketPriorityArray.find(p => p.id == state.ticket.priority);
    return (
        <Card className="h-full flex flex-col">
            <div className="flex flex-col items-start mb-2">
                <h1 className="text-xl font-bold text-gray-900">{state.ticket.ticket_category_name}</h1>
            </div>
            <div className="flex space-x-2 mb-6">
                <Tag bgColor={status?.bg} textColor={status?.fg}>{status?.name}</Tag>
                <Tag bgColor={priority?.bg} textColor={priority?.fg}>{priority?.name}</Tag>
                <Tag bgColor="bg-blue-100" textColor="text-blue-700">{getTicketCategoryActionName(state.ticket.ticket_category_type)}</Tag>
            </div>

            {/* Message Bubble */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex-grow overflow-y-auto custom-scrollbar">
                <div className="flex items-start mb-4">
                    <Avatar>
                        <AvatarImage src={state.user.image} />
                        <AvatarFallback>{nameLetter(state.user.first_name)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                        <p className="font-semibold text-gray-900">{state.user.first_name} {state.user.last_name}</p>
                        <p className="text-xs text-gray-500">{moment(state.ticket.created_at).format('DD MMM, Y LT')}</p>
                    </div>
                </div>

                <p className="text-gray-700 mb-3">{state.ticket.remarks}</p>
                {state.items.length > 0 && <>
                    <p className="text-gray-700 font-medium mb-2">{state.items.length} Items</p>
                    <div className="grid gap-3">
                        {state.items.map(item => (
                            <div key={item.id} className="border rounded-lg p-3 shadow-sm bg-white">
                                <div className="font-medium text-base">{item.name}</div>
                                <div className="text-sm text-gray-600">{item.description}</div>

                                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                                    <div>₹{item.total}</div>
                                    <div>Qty: {item.quantity}</div>
                                    {item.valid_from && <div>From: {moment(item.valid_from).format('DD MMM, Y')}</div>}
                                    {item.valid_to && <div>To: {moment(item.valid_to).format('DD MMM, Y')}</div>}
                                </div>
                            </div>
                        ))}
                    </div>

                </>}
                <p className="text-gray-700 font-medium mb-2">2 Attachments</p>

                {/* Attachments */}
                <div className="flex flex-wrap mt-3">
                    {mockAttachments.map((att, index) => (
                        <MessageAttachment key={index} {...att} />
                    ))}
                </div>
            </div>

            {/* Reply Composer */}
            {!is_member && <div className='p-3 py-5 flex flex-col justify-center items-center bg-slate-50  border border-sky-400 rounded-lg'>
                <span className=''>Join Ticket</span>
                <span>To reply to this ticket you need to join the ticket first</span>
                <Btn variant={'destructive'} size={'sm'}>Join Ticket</Btn>
            </div>}
            {is_member && <div className="mt-4 border border-gray-200 rounded-xl p-4">

                <div className='flex flex-row items-center gap-2 mb-3'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={context.user.image} />
                        <AvatarFallback>{nameLetter(context.user.first_name)}</AvatarFallback>
                    </Avatar>
                    <div className='text-sm flex flex-col'>
                        <span>{context.user.first_name} {context.user.last_name}</span>
                        <span className='text-xs'>Replying as</span>
                    </div>
                </div>
                <Richtext value={form.content} onChange={setValue('content')} placeholder='Enter your message'>Message</Richtext>

                <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                    <div className="flex space-x-3 text-gray-500">
                        <Btn size={'sm'} variant={'outline'}><LuPaperclip /></Btn>
                        <Btn size={'sm'} variant={'outline'}><LuImage /></Btn>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-md hover:bg-indigo-700 transition duration-150 flex items-center gap-1">
                        <span>Send</span>
                        <LuSend />
                    </button>
                </div>
            </div>}
        </Card>
    );
};

const Sidebar = ({ state }: { state: TicketState }) => {


    return (
        <div className="space-y-4">
            {/* Ticket Actions Dropdown */}
            <div className="relative">
                <select className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 shadow-lg cursor-pointer">
                    <option>Ticket actions</option>
                    <option>Close Ticket</option>
                    <option>Merge Ticket</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>


            {/* Visitor Information */}
            <InfoSection state={state} title="Client Information" />

            <TeamSection state={state} />

            {/* Device Info */}
            {state.ticket.order && <OrderSection state={state} title="Order Information" />}
            {/* Files Shared */}
            <FilesShared />
        </div>
    );
};


const MessageAttachment = ({ name, size, type }: { name: string; size: string; type: string; }) => {
    const isPDF = type === 'pdf';
    return (
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 w-48 mr-4 mb-4">
            <div className="flex items-center">
                {isPDF ? (
                    <div className="bg-red-500 p-1 rounded mr-2">
                        <span className="text-white text-xs font-bold">PDF</span>
                    </div>
                ) : (
                    <div className="bg-gray-200 p-1 rounded mr-2">
                        {/* Simple image placeholder icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <div>
                    <p className="text-xs font-medium text-gray-800 truncate w-24">{name}</p>
                    <p className="text-xs text-gray-500">{size}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <a href="#" className="text-gray-400 hover:text-indigo-500">
                    <Download className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

const TeamSection = ({ state }: { state: TicketState }) => (
    <Card className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold text-gray-800">Teams</h3>
        </div>

        {state.teams.length == 0 && <div className='bg-red-50 border border-red-400 rounded-lg text-center py-3 flex flex-col items-center justify-center gap-2 '>
            <span className='text-xs italic'>Not Assigned to any team yet</span>
            <Btn size={'xs'} variant={'destructive'}>Assign Team <LuUserPlus /></Btn>
        </div>}

        {state.teams.map(team => {
            return <div key={team.id} className='bg-green-50 border border-green-300 rounded-lg flex flex-col p-2'>
                <span className='text-green-600 font-medium text-sm'>{team.name}</span>
                {team.managers.map(manager => {
                    return <div className="flex flex-col gap-2 items-start bg-white border rounded-lg p-2">
                        <div className='flex flex-row items-center'>
                            <Avatar>
                                <AvatarImage src={manager.image} />
                                <AvatarFallback>{nameLetter(manager.first_name)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <p className="font-semibold text-gray-900">{manager.first_name} {manager.last_name}</p>
                                <p className="text-xs text-gray-500">Manager</p>

                            </div>
                        </div>
                        <div className='flex flex-row items-center gap-3'>
                            <span className='text-xs font-medium'>Email</span>
                            <span className='text-xs'>{manager.email}</span>
                        </div>
                        <div className='flex flex-row items-center gap-3'>
                            <span className='text-xs font-medium'>Phone</span>
                            <span className='text-xs'>{manager.mobile}</span>
                        </div>
                    </div>

                })}
            </div>
        })}
        <div className="flex justify-between items-center my-2">
            <h3 className="text-base font-semibold text-gray-800">Members</h3>
        </div>

        {state.users.length == 0 && <div className='bg-red-50 border border-red-400 rounded-lg text-center py-3 flex flex-col items-center justify-center gap-2 '>
            <span className='text-xs italic'>No Member have joined the ticket yet</span>
            <Btn size={'xs'} variant={'destructive'}>Assign Team Member <LuUserPlus /></Btn>
        </div>}
        {state.users.map(user => {
            return <div className="flex flex-col gap-2 items-start bg-white border rounded-lg p-2">
                <div className='flex flex-row items-center'>
                    <Avatar>
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{nameLetter(user.first_name)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                        <p className="font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500">Team Member</p>

                    </div>
                </div>
                <div className='flex flex-row items-center gap-3'>
                    <span className='text-xs font-medium'>Email</span>
                    <span className='text-xs'>{user.email}</span>
                </div>
                <div className='flex flex-row items-center gap-3'>
                    <span className='text-xs font-medium'>Phone</span>
                    <span className='text-xs'>{user.mobile}</span>
                </div>
            </div>

        })}
    </Card>
);


const InfoSection = ({ title, state }: { state: TicketState, title: string }) => (
    <Card className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
        <dl className="space-y-1">
            <div className="flex text-sm text-gray-600 items-start py-1">
                <dt className="w-1/3 text-gray-500">Email</dt>
                <dd className="w-2/3 text-gray-800"><a href="#" className="text-indigo-600 hover:underline">{state.user.email}</a></dd>
            </div>
            <div className="flex text-sm text-gray-600 items-start py-1">
                <dt className="w-1/3 text-gray-500">Phone</dt>
                <dd className="w-2/3 text-gray-800"><span>{state.user.mobile}</span></dd>
            </div>


            <div className="flex text-sm text-gray-600 items-start py-1">
                <dt className="w-1/3 text-gray-500">Create On</dt>
                <dd className="w-2/3 text-gray-800"><span>{moment(state.ticket.created_at).format('DD MMM, Y LT')}</span></dd>
            </div>
        </dl>
    </Card>
);


const OrderSection = ({ title, state }: { state: TicketState, title: string }) => (
    <Card className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
        <dl className="space-y-1">
            <div className="flex text-sm text-gray-600 items-start py-1">
                <dt className="w-1/3 text-gray-500">Order ID:-</dt>
                <dd className="w-2/3 text-gray-800"><NavLink to={'/orders/' + state.ticket.order.internal_reference_number} target='_blank' className="text-indigo-600 hover:underline">{state.ticket.order.internal_reference_number}</NavLink></dd>
            </div>



            <div className="flex text-sm text-gray-600 items-start py-1">
                <dt className="w-1/3 text-gray-500">Date & Time</dt>
                <dd className="w-2/3 text-gray-800"><span>{moment(state.ticket.order.created_at).format('DD MMM, Y LT')}</span></dd>
            </div>
        </dl>
    </Card>
);

const FilesShared = () => (
    <Card title="Files Shared" className="mb-4">
        <div className="space-y-3">
            {[
                { name: 'image.jpg', type: 'image' },
                { name: 'doc.pdf', type: 'pdf' },
                { name: 'error-number.jpg', type: 'image' },
            ].map((file, index) => (
                <div key={index} className="flex items-center">
                    <FileIcon type={file.type} />
                    <div className="ml-3 text-sm">
                        <p className="text-gray-800 font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">Shared with Agent Lisa on May 25th</p>
                    </div>
                </div>
            ))}
        </div>
        <a href="#" className="mt-4 block text-indigo-600 text-sm font-medium hover:underline">Show more</a>
    </Card>
);

const FileIcon = ({ type }: { type: string }) => (
    <div className={`p-2 rounded-lg ${type === 'pdf' ? 'bg-red-500' : 'bg-gray-200'}`}>
        {type === 'pdf' ? (
            <span className="text-white text-xs font-bold">PDF</span>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )}
    </div>
);


export default function TicketDetails() {
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>()
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [state, setState] = useState<TicketState>();

    const load = async () => {
        setLoading(true);
        var r = await TicketService.detail(internal_reference_number as string);
        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            navigate('/tickets');
        }
    }

    useEffect(() => {
        load();
    }, [internal_reference_number])

    if (loading || !state) {
        return <TicketDetailSkeleton />
    }

    return (
        <>
            <div className="lg:col-span-6">
                <ConversationDetails state={state} />
            </div>



            <div className="lg:col-span-3">
                <Sidebar state={state} />
            </div>
        </>
    )
}
