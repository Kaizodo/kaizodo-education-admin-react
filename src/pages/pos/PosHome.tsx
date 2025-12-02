import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import PosActionsWidget from "./widgets/PosActions";
import PosCustomerWidget from "./widgets/PosCustomer";
import PosHeader from "./widgets/PosHeader";
import PosPriceWidget from "./widgets/PosPrice";
import PosProductsWidget from "./widgets/PosProducts";
import { EcommerceProductType } from "@/types/Product";
import { KeyType } from "./widgets/PosNumpad";
import { Storage } from "@/lib/Storage";
import { useGlobalContext } from "@/hooks/use-global-context";

type PosContextType = {
    section: 'product_search' | 'customer_search' | 'product',
    numkey: number,
    products: EcommerceProductType[],
    party: any,
    billingAddress: any,
    shippingAddress: any
}

const DefaultPosContext: PosContextType = {
    section: 'product_search',
    numkey: KeyType.None,
    products: [],
    party: undefined,
    billingAddress: undefined,
    shippingAddress: undefined
};

export const PosContext = createContext<{
    posContext: PosContextType,
    setPosContext: React.Dispatch<React.SetStateAction<PosContextType>>
}>({
    posContext: DefaultPosContext,
    setPosContext: () => { }
});

export default function PosHomePage() {
    const { context } = useGlobalContext();
    const [state, setState] = useState<PosContextType>(DefaultPosContext);

    useEffect(() => {
        Storage.set('pos_state_' + context.business_location_id + '_' + context.business_id, state);
    }, [state, context])

    useLayoutEffect(() => {
        Storage.get<PosContextType>('pos_state_' + context.business_location_id + '_' + context.business_id).then((ps) => {
            if (ps) {
                setState(ps);
            }
        })
    }, [context])




    return (
        <PosContext.Provider value={{ posContext: state, setPosContext: setState }}>
            <div className="h-screen w-screen flex flex-col">
                <PosHeader />
                <div className="grid grid-cols-5 bg-white border-t flex-1 min-h-0">
                    <div className="col-span-3 flex flex-col min-h-0">
                        <PosProductsWidget />
                    </div>
                    <div className="col-span-2 border-s flex flex-col min-h-0">
                        <PosCustomerWidget />
                        <PosPriceWidget />
                        <PosActionsWidget />
                    </div>
                </div>
            </div>
        </PosContext.Provider>

    )
}
