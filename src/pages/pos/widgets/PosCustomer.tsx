import { Badge } from "@/components/ui/badge";
import NameToDpWidget from "@/components/widgets/NameToDp";
import { useContext, useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaPencil, FaPlus } from "react-icons/fa6";
import { PosContext } from "../PosHome";
import { useDebounce } from "@/hooks/use-debounce";
import { BusinessTransactionService, ToPlatform, TransactionFulfillment } from "@/services/BusinessTransactionService";
import Btn from "@/components/widgets/Btn";
import { LuLoader } from "react-icons/lu";
import CenterLoading from "@/components/widgets/CenterLoading";
import TextField from "@/components/widgets/TextField";
import { useSetValue } from "@/hooks/use-set-value";
import Dropdown from "@/components/widgets/Dropdown";
import { SuggestService } from "@/services/SuggestService";
import Radio from "@/components/widgets/Radio";
import ListItem from "@/components/widgets/ListItem";
import { Modal, ModalBody, ModalFooter } from "@/lib/Modal";
import { AddressType } from "@kaizodo/volocals-common/user";

const PostCustomerSuggest = ({ party, onClick }: { party: Party, onClick: () => void }) => {
    return <div className="flex flex-row items-center gap-3 border-b p-2 hover:bg-red-50 cursor-pointer" onClick={onClick}>
        <NameToDpWidget name={party.name} size={40} />
        <div className="flex flex-col">
            <span>{party.name}</span>
            <span>{party.mobiles}</span>
        </div>
    </div>
}

type Party = {
    id: number;
    name: string;
    emails: string;
    mobiles: string;
    to_platform: ToPlatform,
    type: "dealer" | "distributor" | "retailer" | "wholesaler";
};









export default function PosCustomerWidget() {
    const { posContext, setPosContext } = useContext(PosContext);
    const [records, setRecords] = useState<Party[]>([]);
    const [searching, setSearching] = useState(false);
    const [mode, setMode] = useState<'mobile' | 'gst' | 'vid'>('mobile');
    const inputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<any>({
        billing_address: {},
        shipping_address: {},
        fullfilment: TransactionFulfillment.Pickup
    });
    const setValue = useSetValue(setForm);

    const debounce = useDebounce((keyword: string) => {
        search(keyword);
    }, 100);

    const search = async (keyword: string) => {
        if (!keyword) {
            return;
        }
        setSearching(true);

        var r = await BusinessTransactionService.searchTranscationParty({
            mode: mode,
            page: 1,
            keyword
        });
        if (r.success) {
            setRecords(r.data);
        }
        setSearching(false);
    }







    const createAddress = () => {
        Modal.show({
            title: 'Create New Address',
            content: () => {
                const [addressForm, setAddressForm] = useState<any>({});
                const [savingAddress, setSavingAddress] = useState(false);
                const setAddressFormValue = useSetValue(setAddressForm);


                const saveAddress = async () => {
                    setSavingAddress(true);
                    var f = Object.assign({}, addressForm);
                    f = { ...f, to_platform: posContext.party.to_platform };
                    var r = await BusinessTransactionService.createTranscationPartyAddress(f);
                    if (r.success) {
                        if (form.address_pick_type == 'shipping') {
                            setPosContext(s => ({ ...s, shippingAddress: r.data }));
                        } else if (form.address_pick_type == 'billing') {
                            setPosContext(s => ({ ...s, billingAddress: r.data }));
                        }
                        Modal.closeAll();
                    }
                    setSavingAddress(false);
                }
                return <>
                    <ModalBody>
                        <TextField value={addressForm.name} onChange={setAddressFormValue('name')}>Name</TextField>
                        <TextField value={addressForm.mobile} onChange={setAddressFormValue('mobile')}>Mobile</TextField>
                        <TextField value={addressForm.email} onChange={setAddressFormValue('email')}>Email</TextField>
                        <Dropdown value={addressForm.state_id} onChange={setAddressFormValue('state_id')} searchable placeholder='Select state' getOptions={async (filters) => {
                            var r = await SuggestService.suggestStates(filters);
                            return r.data;
                        }}>State</Dropdown>
                        <Dropdown value={addressForm.city_id} onChange={setAddressFormValue('city_id')} searchable placeholder='Select city' getOptions={async (filters) => {
                            var r = await SuggestService.suggestCities({ ...filters, state_id: form.state_id });
                            return r.data;
                        }}>City</Dropdown>
                        <TextField value={addressForm.pincode} onChange={setAddressFormValue('pincode')}>Pincode</TextField>
                        <TextField value={addressForm.address} onChange={setAddressFormValue('address')} multiline>Address Line</TextField>
                        <TextField value={addressForm.landmark} onChange={setAddressFormValue('landmark')}>Landmark</TextField>
                        <Radio options={[
                            { id: AddressType.Home, name: 'Home' },
                            { id: AddressType.Work, name: 'Work' }
                        ]} value={addressForm.type} onChange={setAddressFormValue('type')} />
                    </ModalBody>
                    <ModalFooter>

                        <Btn onClick={saveAddress} loading={savingAddress}>Save Address</Btn>
                    </ModalFooter>
                </>
            }
        })
    }

    const pickAddress = async (type: 'billing' | 'shipping') => {
        setValue('address_pick_type')(type);

        const modal = Modal.show({
            title: 'Select address',
            content: () => {
                const [searchingAddress, setSearchingAddress] = useState(false);
                const [addresses, setAddresses] = useState([]);

                const searchAddress = async () => {
                    if (!posContext.party) {
                        return;
                    }
                    var form = {
                        to_platform: posContext.party.to_platform,
                        business_party_id: 0,
                        party_business_location_id: 0,
                        party_user_id: 0,
                    };
                    if (posContext.party.to_platform == ToPlatform.BusinessLocation) {
                        form.party_business_location_id = posContext.party.id;
                    } else if (posContext.party.to_platform == ToPlatform.Party) {
                        form.business_party_id = posContext.party.id;
                    } else if (posContext.party.to_platform == ToPlatform.User) {
                        form.party_user_id = posContext.party.id;
                    }
                    setSearchingAddress(true);
                    var r = await BusinessTransactionService.searchTranscationPartyAddress(form);

                    if (r.success) {
                        if (r.data.length == 0) {
                            Modal.close(modal);
                            createAddress();
                        } else {
                            setAddresses(r.data);
                        }
                    }
                    setSearchingAddress(false);
                }
                useEffect(() => {
                    searchAddress();
                }, [])
                return <>
                    <ModalBody>
                        {searchingAddress && <CenterLoading className="absolute" />}
                        {addresses.map((address: any) => <ListItem
                            key={'add_' + address.id}
                            onClick={() => {
                                if (form.address_pick_type == 'shipping') {
                                    setPosContext(s => ({ ...s, shippingAddress: address }));
                                } else if (form.address_pick_type == 'billing') {
                                    setPosContext(s => ({ ...s, billingAddress: address }));
                                }
                                Modal.closeAll();
                            }}
                            title={address.name}
                            subtitle={[address.address, address.city_name, address.state_name, address.pincode].filter(a => !!a).join(', ')}
                        />)}
                    </ModalBody>
                    <ModalFooter> <Btn onClick={createAddress}>Add New</Btn></ModalFooter>
                </>
            }
        })

    }

    return (
        <div className="w-full mb-auto">
            {!!posContext.party && <div className="w-full">
                <div className="flex flex-row  w-full border-b">
                    <div className="flex flex-row items-center gap-3  p-2 flex-1">
                        <NameToDpWidget name={posContext.party.name} size={40} />
                        <div className="flex flex-col">
                            <span>{posContext.party.name}</span>
                            <span>{posContext.party.mobiles}</span>
                        </div>
                    </div>
                    <div className="bg-primary  text-primary-foreground w-[60px] items-center justify-center flex border-r">
                        <FaPencil size={20} />
                    </div>
                    <div className="bg-primary  text-primary-foreground w-[60px] items-center justify-center flex " onClick={() => {
                        setPosContext(s => ({ ...s, party: undefined }))
                    }}>
                        <FaTimes size={30} />
                    </div>
                </div>




                {!!posContext.billingAddress && <div className="flex flex-row  w-full border-b">
                    <div className="flex flex-col gap-1  p-2 flex-1">
                        <Badge>Billing Aaddress</Badge>
                        <div className="flex flex-row items-center gap-2">
                            <span className="font-bold">{posContext.billingAddress.name}</span>
                            <span className="text-sm">{posContext.billingAddress.mobiles}</span>
                        </div>
                        <span className="text-sm">{[posContext.billingAddress.address, posContext.billingAddress.city_name, posContext.billingAddress.state_name, posContext.billingAddress.pincode].filter(a => !!a).join(', ')}</span>
                    </div>

                    <div className="bg-primary  text-primary-foreground w-[60px] items-center justify-center flex " onClick={() => {
                        setPosContext(s => ({ ...s, billingAddress: undefined }))
                    }}>
                        <FaTimes size={30} />
                    </div>
                </div>}
                {!!posContext.shippingAddress && <div className="flex flex-row  w-full border-b">
                    <div className="flex flex-col gap-1  p-2 flex-1">
                        <Badge>Shipping Aaddress</Badge>
                        <div className="flex flex-row items-center gap-2">
                            <span className="font-bold">{posContext.shippingAddress.name}</span>
                            <span className="text-sm">{posContext.shippingAddress.mobiles}</span>
                        </div>
                        <span className="text-sm">{[posContext.shippingAddress.address, posContext.shippingAddress.city_name, posContext.shippingAddress.state_name, posContext.shippingAddress.pincode].filter(a => !!a).join(', ')}</span>
                    </div>

                    <div className="bg-primary  text-primary-foreground w-[60px] items-center justify-center flex " onClick={() => {
                        setPosContext(s => ({ ...s, shippingAddress: undefined }))
                    }}>
                        <FaTimes size={30} />
                    </div>
                </div>}

                {!posContext.billingAddress && <div
                    className="flex flex-row items-center p-3 gap-2  w-full border-b hover:bg-red-50 active:bg-red-300"
                    onClick={() => pickAddress('billing')}
                >
                    <FaPlus size={30} />
                    <span className="text-1xl font-bold flex-1">Add Billing Address</span>
                </div>}
                {!posContext.shippingAddress && <div
                    className="flex flex-row items-center p-3 gap-2  w-full border-b hover:bg-red-50 active:bg-red-300"
                    onClick={() => pickAddress('shipping')}
                >
                    <FaPlus size={30} />
                    <span className="text-1xl font-bold flex-1">Add Shipping Address</span>
                </div>}

            </div>}
            {!posContext.party && <div className="relative w-full  border-b">
                <div className="flex flex-row p-2">
                    <input
                        type="text"
                        placeholder="Customer mobile , gst number"
                        className="flex-1 pl-3 pr-10 py-3 rounded-0 border border-gray-300 shadow-inner outline-none text-lg bg-gray-50"
                        onChange={(e) => {
                            setSearching(true);
                            debounce(e.target.value);
                        }}
                    />
                    <div className="bg-primary  text-primary-foreground w-[60px] items-center justify-center flex ">
                        {searching && <LuLoader size={30} className="animate-spin" />}
                        {!searching && <FaPlus size={30} />}
                    </div>
                </div>
                <div className="absolute top-full bg-white w-full border-t shadow-sm z-50">
                    {records.map(customer => <PostCustomerSuggest
                        key={'customer_' + customer.id}
                        party={customer}
                        onClick={() => {
                            if (inputRef.current) {
                                inputRef.current.value = '';
                            }
                            setRecords([]);
                            setPosContext(s => ({ ...s, party: customer }))
                        }} />)}
                </div>
            </div>}
            {!posContext.party && <div className="flex flex-row items-start p-2 gap-2 border-b">
                <Btn onClick={() => setMode('mobile')} variant={mode == 'mobile' ? 'default' : 'secondary'}>Mobile</Btn>
                <Btn onClick={() => setMode('gst')} variant={mode == 'gst' ? 'default' : 'secondary'}>Gst Number</Btn>
                <Btn onClick={() => setMode('vid')} variant={mode == 'vid' ? 'default' : 'secondary'}>V-ID</Btn>
            </div>}


        </div>
    )
}
