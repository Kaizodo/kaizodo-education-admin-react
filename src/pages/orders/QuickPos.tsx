import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
    Search, User, Calendar, Globe, X, Plus, Edit, Trash2, Tag, CreditCard, ShoppingCart, ClipboardList, CheckCheck, Store, FileText, Users, Clock, Save, FileSignature, DollarSign as CurrencyIcon, Package, Layers, SquareGanttChart
} from 'lucide-react';
import { LuBadgePercent, LuChevronDown, LuCircle, LuCircleCheck, LuPackage, LuPlus, LuUserPlus, LuUserX, LuX } from 'react-icons/lu';
import CenterLoading from '@/components/common/CenterLoading';
import { ProductService } from '@/services/ProductService';
import { useForm } from '@/hooks/use-form';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useDebounce } from '@/hooks/use-debounce';
import moment from 'moment';
import { formatDate } from '@/lib/utils';
import DateTimeField from '@/components/common/DateTimeField';
import { ClientService } from '@/services/ClientService';
import NoRecords from '@/components/common/NoRecords';
import Btn from '@/components/common/Btn';
import { Modal, ModalBody, ModalFooter } from '@/components/common/Modal';
import CustomerForm from './components/pos/CustomerForm';
import CustomerProfileForm from './components/pos/CustomerProfileForm';
import SuggestDiscount from '@/components/common/suggest/SuggestDiscount';
import { PaymentMethodArray } from '@/data/user';
import { calculateOrder } from './components/helpers/TaxCalculator';
import { useGlobalContext } from '@/hooks/use-global-context';
import SafeImage from '@/components/common/SafeImage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TextField from '@/components/common/TextField';


interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    mobile: string;
    email: string;
    address: {
        billing: string;
        shipping: string;
        country: string;
    };
}

interface Product {
    id: string;
    name: string;
    sku: string;
    mrp: number;
    sp: number; // Selling Price (Unit Price)
    image: string;
    quantity: number;
}




type ActiveView = 'OrderLine' | 'Invoices' | 'Drafts' | 'Closing' | 'Customers' | 'Products';





const MOCK_COUNTS = {
    Invoices: 45,
    Drafts: 3,
    Customers: 502,
    Products: 120,
};


export default function QuickPos() {
    const { context } = useGlobalContext();
    const [form, setValue] = useForm<any>({
        loaded: false,
        country_id: undefined,
        invoice_date: moment().format('Y-MM-DD'),
        user_id: undefined,
        products: []
    })


    var calculated = calculateOrder(form);



    // New POS Workflow States
    const [currentOrderLineId, setCurrentOrderLineId] = useState(1);
    const [activeView, setActiveView] = useState<ActiveView>('OrderLine');

    const openCustomerSearchModal = () => {
        const modal_id = Modal.show({
            title: 'Customer',
            content: () => {
                const [searching, setSearching] = useState(false);

                const [filters, setFilter] = useForm({
                    page: 1,
                    keyword: '',
                    include_lead: true,
                    include_profile: true,
                    dont_search: false
                });
                const [paginated, setPaginated] = useState<PaginationType<Customer>>(getDefaultPaginated());


                const debounceSearch = useDebounce(() => {
                    search();
                }, 100)

                const search = async () => {
                    setSearching(true);
                    var r = await ClientService.search(filters);
                    if (r.success) {
                        setPaginated(r.data);
                        setSearching(false);
                    }
                }




                useEffect(() => {
                    if (!filters.dont_search) {
                        setSearching(true);
                        debounceSearch();
                    }
                }, [filters])
                return (<>
                    <ModalBody>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by mobile number or name"
                                    value={filters.keyword}
                                    onChange={(e) => setFilter('keyword', 'debounce')(e.target.value, true)}

                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-base h-12"
                                />
                            </div>

                            <div className="h-60 overflow-y-auto border border-gray-200 rounded-xl">
                                {searching && <CenterLoading className='h-60 relative' />}
                                {!searching && paginated.records.length == 0 && <NoRecords icon={LuUserX} title='No Customers Found' subtitle='Try changing search criteria or create new' action={<Btn variant={'outline'} size={'sm'} onClick={() => openCustomerCreationModel(filters.keyword)}><LuPlus /> Add New</Btn>} />}
                                {!searching && paginated.records.map(c => (
                                    <div
                                        key={c.id}
                                        className={`p-3 border-b hover:bg-indigo-50 cursor-pointer flex justify-between items-center ${form?.customer?.id === c.id ? 'bg-indigo-100' : 'bg-white'}`}
                                        onClick={() => {
                                            setValue('customer')(c);
                                            setFilter('keyword', 'dont_search')('', false);
                                            Modal.close(modal_id)
                                        }}
                                    >
                                        <div>
                                            <p className="font-semibold text-base text-gray-800">{c.first_name} {c.last_name}{!c.first_name && 'Unnamed Customer'}</p>
                                            <p className="text-sm text-gray-500">{c.mobile}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>


                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Btn variant={'destructive'} onClick={() => openCustomerCreationModel(filters.keyword)}>
                            <Plus size={18} className="mr-2" /> New Customer
                        </Btn>

                    </ModalFooter>
                </>);
            }
        })
    }

    const openCustomerCreationModel = (mobile?: string) => {
        const modal_id = Modal.show({
            title: 'Add New Customer',
            maxWidth: 500,
            content: () => {
                return <CustomerForm
                    mobile={mobile}
                    onSuccess={(data) => {
                        setValue('customer')(data);
                        Modal.closeAll();
                    }} onCancel={() => Modal.close(modal_id)} />
            }
        })
    }

    const openInvoiceConfigModal = () => {
        const modal_id = Modal.show({
            title: 'Invoice Configuration',
            content: () => {

                return (<>
                    <ModalBody>
                        <div className="space-y-4">
                            <DateTimeField value={form.invoice_date} onChange={setValue('invoice_date')} previewFormat="DD MMM, Y" mode='date' placeholder='Invoice Date'>Invoice Date</DateTimeField>
                            <DateTimeField value={form.due_date} onChange={setValue('due_date')} previewFormat="DD MMM, Y" mode='date' placeholder='Due Date'>Due Date</DateTimeField>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Btn onClick={() => {
                            Modal.close(modal_id);
                        }}>Save Configuration</Btn>
                    </ModalFooter>
                </>);
            }
        })
    }


    // --- Core Logic: Cart Management ---

    const addProductToCart = async (product: Product, quantity: number = 1) => {



        var existing = form.products.find((p: Product) => p.id == product.id);

        if (existing) {
            setValue(`products[id:${product.id}].quantity`)(Number(existing.quantity) + Number(quantity));
        } else {
            setValue('products[]')({ ...product, quantity })
        }


    }




    // --- UI Components Sections ---

    // Refined Header with Tab Navigation
    const AppHeader = (
        <header className="bg-indigo-700 text-white shadow-xl sticky top-0 z-20">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

                {/* Store Name and Logo */}
                <div className="flex items-center space-x-3 min-w-fit">
                    <Store size={28} className="text-indigo-200" />
                    <h1 className="text-xl font-bold tracking-tight">Rapid POS</h1>
                </div>

                {/* Navigation Tabs (Touch Friendly) */}
                <nav className="flex-1 flex justify-center h-full">
                    {[
                        { id: 'OrderLine', icon: ShoppingCart, label: `Order Line #${currentOrderLineId}`, count: null, color: 'text-yellow-300' },
                        { id: 'Drafts', icon: Save, label: 'Drafts', count: MOCK_COUNTS.Drafts, color: 'text-blue-300' },
                        { id: 'Invoices', icon: FileText, label: 'Invoices', count: MOCK_COUNTS.Invoices, color: 'text-green-300' },
                        { id: 'Customers', icon: Users, label: 'Customers', count: MOCK_COUNTS.Customers, color: 'text-pink-300' },
                        { id: 'Closing', icon: Clock, label: "Today's Closing", count: null, color: 'text-red-300' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id as ActiveView)}
                            className={`flex items-center space-x-2 text-sm md:text-base font-semibold px-4 transition-all h-full
                ${activeView === item.id
                                    ? 'bg-indigo-800 border-b-4 border-yellow-400 text-white'
                                    : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                                }
              `}
                            style={{ minWidth: '130px' }} // Ensure touch target size
                        >
                            <item.icon size={20} className={item.color} />
                            <span className="hidden sm:inline">{item.label}</span>
                            {item.count !== null && (
                                <span className="bg-white/20 px-2 rounded-full text-xs font-bold">
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User Profile / Time */}
                <div className="flex items-center space-x-3 min-w-fit text-sm">
                    <User size={20} className="text-white" />
                    <span>Cashier 101</span>
                </div>
            </div>
        </header>
    );


    const ProfileList = () => {
        const [open, setOpen] = useState(false);

        return (
            <div className="border rounded-xl mt-3">
                <div
                    className="flex justify-between items-center p-3 cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    <h3 className="font-semibold text-gray-800 text-sm">Customer Profiles</h3>
                    <LuChevronDown className={`text-xl text-gray-600 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
                </div>


                <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-[500px]" : "max-h-0"}`} >
                    <div className="flex flex-col space-y-2 p-2 max-h-[300px] overflow-y-auto">
                        {form.customer?.profiles.length == 0 && <span className='text-xs italic text-gray-600'>No Profiles Found</span>}
                        {form.customer?.profiles.map((profile: any) => {
                            const isSelected = form.user_profile_id === profile.id;

                            return (
                                <div
                                    key={profile.id}
                                    onClick={() => setValue('user_profile_id', 'state_id')(profile.id, profile.state_id)}
                                    className={` border rounded-lg cursor-pointer transition-all duration-300  overflow-hidden p-3 ${isSelected ? "border-purple-600 bg-purple-50" : "border-gray-200 bg-white hover:border-purple-400"}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h4 className="font-semibold text-gray-800 text-sm truncate">
                                                {profile.name}
                                            </h4>

                                            {!!profile.organization_name && (
                                                <p className="text-xs text-black truncate">
                                                    {profile.organization_name}
                                                </p>
                                            )}

                                            {!!profile.gst_number && (
                                                <p className="text-[11px] text-gray-500">
                                                    GST: {profile.gst_number}
                                                </p>
                                            )}
                                        </div>

                                        {isSelected ? (
                                            <LuCircleCheck className="text-lg text-primary" />
                                        ) : (
                                            <LuCircle className="text-lg text-gray-400" />
                                        )}
                                    </div>

                                    <div className={`transition-all duration-300 overflow-hidden ${isSelected ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"}`}>
                                        <p className="text-[11px] text-gray-600 mb-1">
                                            {profile.address}
                                        </p>

                                        <p className="text-[11px] text-black font-medium">
                                            {profile.state_name}, {profile.country_name} -{" "}
                                            {profile.pincode}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className='p-3'>
                        <Btn variant={'outline'} size={'sm'} onClick={() => {
                            const modal_id = Modal.show({
                                title: 'Add New Profile',
                                maxWidth: 500,
                                content: () => <CustomerProfileForm user={form.customer} onSuccess={(profiles) => {
                                    setValue('customer.profiles', 'user_profile_id', 'state_id')(profiles, profiles[0]?.id, profiles[0].state_id);
                                    Modal.close(modal_id);
                                }} />
                            })
                        }}><LuUserPlus /> Add New Profile</Btn>
                    </div>
                </div>
            </div>
        );
    };


    // 1 - Customer Panel (Touch-friendly buttons)
    const CustomerPanel = (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-base font-semibold mb-3 text-gray-700 flex items-center"><User size={20} className="mr-2 text-indigo-500" />Customer Info</h4>
            {form.customer ? (
                <div className="">
                    <p className="font-bold text-xl text-indigo-700 truncate">{form.customer?.first_name} {form.customer?.last_name}</p>
                    <p className="text-sm text-gray-600 flex items-center"><ClipboardList size={16} className="mr-2 text-gray-400" />{form?.customer?.mobile}</p>
                    <div className="flex space-x-3 mt-4">
                        <button
                            onClick={openCustomerSearchModal}
                            className="flex-1 text-sm px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl transition shadow-sm h-10"
                        >
                            <Edit size={16} className="inline mr-2" /> Change
                        </button>
                        <button
                            onClick={() => setValue('customer', 'user_profile_id')()}
                            className="flex-1 text-sm px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition shadow-sm h-10"
                        >
                            <X size={16} className="inline mr-2" /> Clear
                        </button>
                    </div>

                    <ProfileList />



                </div>
            ) : (
                <>
                    <p className="text-sm text-gray-500 mb-4">No customer selected.</p>
                    <button onClick={openCustomerSearchModal} className="w-full text-base px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition h-12">
                        <Search size={18} className="inline mr-2" /> Find / Add Customer
                    </button>
                </>
            )}
        </div>
    );



    // 6 - Discount Panel
    const DiscountPanel = (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-base font-semibold mb-3 text-gray-700 flex items-center"><Tag size={20} className="mr-2 text-purple-500" />Coupon Code</h4>
            <SuggestDiscount
                valid_only={true}
                load_applications={true}
                value={form.discount_plan_id}
                onChange={(v) => {
                    if (!v) {
                        setValue('discount_plan_id', 'discount_plan')(v)
                    } else {
                        setValue('discount_plan_id')(v)
                    }

                }}
                onSelect={setValue('discount_plan')}
                placeholder="Select a discount plan"
            />

        </div>
    );

    // 2 - Product Search Panel
    const ProductSearchPanel = () => {
        const [searching, setSearching] = useState(false);
        const enterRef = useRef<boolean>(false);

        const [filters, setFilter] = useForm({
            page: 1,
            keyword: '',
            dont_search: false
        });
        const [paginated, setPaginated] = useState<PaginationType<Product>>(getDefaultPaginated());


        const debounceSearch = useDebounce(() => {
            search();
        }, 100)

        const search = async () => {
            setSearching(true);
            var r = await ProductService.searchByPrice(filters);
            if (r.success) {
                setPaginated(r.data);
                setSearching(false);
                if (enterRef.current) {
                    addProductToCart(r.data.records[0]);
                    setFilter('keyword', 'dont_search')('', true)
                    setTimeout(() => {
                        document.getElementById('focus_input')?.focus();
                    }, 50)
                }
            }
        }

        useEffect(() => {
            if (!filters.dont_search) {
                setSearching(true);
                debounceSearch();
            }
        }, [filters])





        return (
            <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 z-10 rounded-t-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center"><Package size={20} className="mr-2 text-indigo-600" />Product Search</h3>
                <div className="flex mb-4">
                    <div className="relative w-full flex flex-row items-center gap-3">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            id='focus_input'
                            placeholder="Search product by name or barcode"
                            value={filters.keyword}
                            onChange={(e) => setFilter('keyword', 'dont_search')(e.target.value, false)}
                            onKeyDown={(e) => {
                                if (e.key.toLowerCase() == 'enter') {
                                    enterRef.current = true;
                                }
                            }}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition text-base h-12"
                        />
                        <button className='bg-white shadow-lg h-full aspect-square shrink-0 rounded-xl text-2xl flex justify-center items-center border border-gray-300'><LuPlus /></button>
                    </div>
                </div>

                {!!filters.keyword && (
                    <div className="max-h-60 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 p-3 space-y-2">
                        {searching && <CenterLoading className="relative h-[150px]" />}
                        {!searching && paginated.records.map(product => (
                            <div onClick={() => addProductToCart(product)} key={product.id} className="flex items-center justify-between p-3 hover:bg-indigo-50 rounded-xl transition cursor-pointer border-b last:border-b-0">
                                <div className="flex items-center space-x-3 flex-1">
                                    <SafeImage src={product.image} className='w-12 h-12 object-cover rounded-lg border border-gray-100 flex items-center justify-center text-3xl text-gray-300'>
                                        <LuPackage />
                                    </SafeImage>
                                    <div className='flex-grow min-w-0'>
                                        <p className="font-semibold text-gray-800 truncate text-base">{product.name}</p>
                                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                                    </div>
                                </div>
                                <div className="text-right text-sm ml-2 hidden sm:block">
                                    <p className="font-bold text-indigo-600 text-base">{context.settings.currency_symbol}{product.sp}</p>
                                    <p className="text-xs text-red-500 line-through">MRP {context.settings.currency_symbol}{product.mrp}</p>
                                </div>

                            </div>
                        ))}
                        {paginated.records.length === 0 && (
                            <p className="text-center text-sm text-gray-500 p-4">No products found for "{filters.keyword}"</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Cart Table (Touch-friendly inputs)
    const CartTable = (<div className="overflow-x-auto ">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Price</TableHead>
                    {/* <TableHead>Taxable</TableHead> */}
                    <TableHead>Discount</TableHead>
                    {/* {calculated.unique_tax_components.map(tax => <TableHead key={tax.tax_component_id}>{tax.tax_component_name}</TableHead>)} */}
                    <TableHead>Total</TableHead>
                    <TableHead>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {form.products.map((product: any) => {
                    var cp = calculated.product_calcs.find(pc => pc.id == product?.id);
                    const base = cp?.base ?? 0;
                    const taxable = cp?.taxable ?? 0;
                    const total = cp?.total ?? 0;
                    const discount = cp?.discount ?? 0;
                    const taxable_discount = cp?.taxable_discount ?? 0;
                    const discount_percentage = cp?.discount_percentage ?? 0;
                    return (
                        <TableRow key={product.id}>

                            <TableCell>
                                <div className='flex flex-row items-center gap-2'>
                                    <SafeImage src={product.image} className='w-12 h-12 object-cover rounded-lg border border-gray-100 flex items-center justify-center text-3xl text-gray-300'>
                                        <LuPackage />
                                    </SafeImage>
                                    <div className='flex flex-col'>
                                        <span className='font-medium text-sm'>{product.name}</span>
                                        <span className='text-xs italic text-gray-600'>Sku - {product.sku}</span>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="w-[100px]">
                                    <TextField value={product.quantity} onChange={setValue(`products[id:${product.id}].quantity`)} type='number' placeholder='Quantity' />
                                </div>
                            </TableCell>
                            <TableCell>{context.settings.currency_symbol}{product.mrp}</TableCell>
                            <TableCell>{context.settings.currency_symbol}{product.sp}</TableCell>
                            {/* <TableCell>{context.settings.currency_symbol}{base.toFixed(2)}</TableCell> */}
                            <TableCell>
                                <div className="flex flex-row items-center gap-1">
                                    <span className="text-sm">{context.settings.currency_symbol}{discount.toFixed(2)}</span>
                                    <span className="text-xs text-gray-500 italic">({discount_percentage.toFixed(2)})%</span>
                                </div>
                            </TableCell>
                            {/* {calculated.unique_tax_components.map(tax => {
                                var tax_calc = cp?.taxes?.find?.(t => t.tax_component_id == tax.tax_component_id);
                                return <TableCell key={tax.tax_component_id}>
                                    <div className="flex flex-row gap-1 items-center">
                                        <span className="text-sm">{context.settings.currency_symbol}{(tax_calc?.amount ?? 0).toFixed(2)}</span>
                                        <span className="text-xs text-gray-500 italic">({tax_calc?.percentage ?? 0}%)</span>
                                    </div>
                                </TableCell>;
                            })} */}

                            <TableCell>
                                {!!product.price && <div>
                                    <span>{context.settings.currency_symbol}{total.toFixed(2)}</span>
                                </div>}
                                {!product.price && <span className="text-xs italic text-gray-500">Select Price</span>}
                            </TableCell>
                            <TableCell>
                                <Btn onClick={() => setValue(`products[id:${product.id}]-`)()} variant={'destructive'} size={'sm'}> <LuX /></Btn>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>


    </div>);

    // 5 - Price Bifurcation (Includes Payment Method and new buttons)
    const PriceSummary = (
        <div className="bg-white p-6 rounded-xl shadow-2xl h-fit sticky top-4 border-2 border-indigo-100">
            <h4 className="text-xl font-bold mb-4 text-gray-800 flex items-center"><CurrencyIcon size={24} className="mr-2 text-indigo-500" />Payment & Summary</h4>

            {/* Payment Method Selection */}
            <div className="mb-4 p-4 bg-indigo-50 rounded-xl">
                <label className=" text-sm font-bold text-indigo-700 mb-2 flex items-center"><CreditCard size={16} className="mr-2" />Select Payment Method</label>
                <div className="flex flex-wrap gap-2">
                    {PaymentMethodArray.map(method => (
                        <button
                            key={method.id}
                            onClick={() => setValue('payment_method')(method.id)}
                            className={`text-sm px-4 py-2 rounded-xl transition-colors h-10 min-w-16 ${form.payment_method === method.id
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
                                }`}
                        >
                            {method.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Financial Breakdown */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4">
                <p className="text-gray-600">Subtotal:</p>
                <p className="text-right font-medium text-gray-800">{context.settings.currency_symbol} {calculated.order_totals.base.toFixed(2)}</p>


                {calculated.grouped_taxes.map((tax, tax_index) => {
                    return <>
                        <p key={tax_index + '_1'} className="text-gray-600 flex items-center">{tax.tax_component_name}:</p>
                        <p key={tax_index + '_2'} className="text-right text-green-600 font-medium">+ {tax.value.toFixed(2)}</p>

                    </>
                })}


            </div>

            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                <LuBadgePercent />
                <span className="font-medium">Total Savings:</span>
                <span>₹{Number(calculated.order_totals.savings || 0).toFixed(2)}</span>
            </div>



            {/* Grand Total Block */}
            <div className="col-span-2 border-t-2 border-indigo-300 pt-4 mt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-gray-700">TOTAL DUE:</p>
                <p className="text-2xl font-extrabold text-right text-indigo-600">
                    {context.settings.currency_symbol} {calculated.order_totals.total.toFixed(2)}
                </p>
            </div>

            {/* Primary Action Button */}
            <button
                disabled={form.products.length === 0}
                className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold text-xl rounded-xl shadow-xl shadow-indigo-400/50 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition h-16"
            >
                Finalize & Pay
            </button>

            {/* Secondary Action Buttons (Draft / Proforma) */}
            <div className="grid grid-cols-2 gap-3 mt-3">
                <button
                    className="py-3 text-sm bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition flex items-center justify-center h-12"
                    title="Save the current cart as a draft invoice."
                >
                    <Save size={18} className="mr-2" /> Save as Draft
                </button>
                <button
                    className="py-3 text-sm bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition flex items-center justify-center h-12"
                    title="Generate a non-binding Proforma Invoice."
                >
                    <FileSignature size={18} className="mr-2" /> Proforma Invoice
                </button>
            </div>
        </div>
    );

    // Content Renderer based on Active View
    const renderContent = () => {
        switch (activeView) {
            case 'OrderLine':
                return (
                    <div className="lg:grid lg:grid-cols-4 lg:gap-6 space-y-6 lg:space-y-0">
                        {/* Column 1 (Left) - Configuration Sidebar (lg:col-span-1) */}
                        <div className="lg:col-span-1 space-y-4">
                            {CustomerPanel}
                            {InvoiceConfigPanel}
                            {DiscountPanel}


                        </div>

                        {/* Column 2 (Center) - Transaction/Cart Area (lg:col-span-2) */}
                        <div className="lg:col-span-2 flex flex-col min-h-[70vh] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            {<ProductSearchPanel />}
                            {CartTable}
                            <div className='p-4'></div>
                        </div>

                        {/* Column 3 (Right) - Price Summary / Breakout (lg:col-span-1) */}
                        <div className="lg:col-span-1 space-y-4">
                            {PriceSummary}
                        </div>
                    </div>
                );
            case 'Invoices':
            case 'Drafts':
            case 'Customers':
                const iconMap: Record<ActiveView, React.ElementType> = {
                    Invoices: FileText,
                    Drafts: Save,
                    Customers: Users,
                    OrderLine: SquareGanttChart, // Not used here
                    Closing: Clock, // Not used here
                    Products: Layers // Not used here
                };
                const CurrentIcon = iconMap[activeView];
                return (
                    <div className="text-center p-20 bg-white rounded-xl shadow-lg">
                        <CurrentIcon size={64} className="mx-auto text-indigo-400 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{activeView} Management</h2>
                        <p className="text-lg text-gray-600">This view would list and manage all your existing {activeView.toLowerCase()}.</p>
                        <p className="text-sm text-gray-500 mt-2">Total {activeView}: {MOCK_COUNTS[activeView as keyof typeof MOCK_COUNTS]}</p>
                        <button
                            onClick={() => setActiveView('OrderLine')}
                            className="mt-6 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
                        >
                            Back to Order Line
                        </button>
                    </div>
                );
            case 'Closing':
                return (
                    <div className="text-center p-20 bg-white rounded-xl shadow-lg">
                        <Clock size={64} className="mx-auto text-red-400 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Daily Round Closing</h2>
                        <p className="text-lg text-gray-600">Here you would tally cash, reconcile payments, and officially close the day's transactions.</p>
                        <button
                            onClick={() => { console.log("Closing the round..."); setCurrentOrderLineId(1); }} // Logic to reset order line count
                            className="mt-6 py-3 px-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                        >
                            Perform Closing & Start New Day
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };




    const InvoiceConfigPanel = (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-base font-semibold mb-3 text-gray-700 flex items-center justify-between">
                <span><Calendar size={20} className="mr-2 inline text-green-500" />Invoice Config</span>
                <button onClick={openInvoiceConfigModal} className="text-sm text-green-600 hover:text-green-700 font-medium p-2 rounded-lg transition h-10">
                    <Edit size={16} className="inline mr-1" /> Edit
                </button>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="col-span-1 p-2 bg-green-50 rounded-lg">
                    <p className="text-gray-500">Date:</p>
                    <p className="font-medium text-green-800">{formatDate(form.inovice_date)}</p>
                </div>
                <div className="col-span-1 p-2 bg-green-50 rounded-lg">
                    <p className="text-gray-500">Due:</p>
                    <p className="font-medium text-green-800">{formatDate(form.due_date)}</p>
                </div>
                <div className="col-span-1 p-2 bg-green-50 rounded-lg">
                    <p className="text-gray-500">Currency:</p>
                    <p className="font-medium text-green-800">{context.settings.currency_code} ({context.settings.currency_symbol})</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {AppHeader}
            <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </div>




        </div>
    );
};
