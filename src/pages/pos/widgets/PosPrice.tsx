import { cn } from "@/lib/Utils"
import { useContext } from "react";
import { PosContext } from "../PosHome";
import { EcommerceProductType } from "@/types/Product";

const PriceRow = ({ name, value, main = false }: { name: string, value: string, main?: boolean }) => {
    return <div className={cn('flex flex-row justify-between items-center mb-1', main ? 'border-t-2 border-dashed border-primary pt-2' : '')}>
        <span className={cn('text-sm', main ? 'font-bold text-2xl' : '')}>{name}</span>
        <span className={cn('font-bold', main ? 'text-2xl' : '')}>{value}</span>
    </div>
}

export default function PosPriceWidget() {
    const { posContext } = useContext(PosContext);

    const calculateProducts = () => {
        let calculated = {
            subtotal: 0,
            total_tax: 0,
            total_items: 0,
            total_discount: 0,
            total_gst: 0,
            total_cgst: 0,
            total_sgst: 0,
            total_igst: 0,
            total_cess: 0,
            total: 0
        };
        posContext.products.forEach((product: EcommerceProductType) => {
            const salePrice = parseFloat(product.sale_price) || 0;
            // const maxRetail = parseFloat(product.max_retail_price) || 0;
            const qty = product.quantity;
            const sub = salePrice * qty;
            const disc = 0;
            const cgstAmt = sub * (product.cgst / 100);
            const sgstAmt = sub * (product.sgst / 100);
            const igstAmt = sub * (product.igst / 100);
            const cessAmt = sub * (product.cess / 100);
            calculated.subtotal += sub;
            calculated.total_discount += disc;
            calculated.total_cgst += cgstAmt;
            calculated.total_sgst += sgstAmt;
            calculated.total_igst += igstAmt;
            calculated.total_cess += cessAmt;
            calculated.total_gst += cgstAmt + sgstAmt + igstAmt;
            calculated.total_tax += cgstAmt + sgstAmt + igstAmt + cessAmt;
            calculated.total_items += qty;
        });
        calculated.total = calculated.subtotal + calculated.total_tax - calculated.total_discount;
        return calculated;
    };

    const calculations = calculateProducts();

    return (
        <div className='grid grid-cols-2 gap-3 px-3 py-2 overflow-auto flex-1 max-h-[230px]'>
            <div className='rounded-sm bg-red-100 px-3 py-1'>
                <span className="text-lg font-bold">Pricing</span>
                <PriceRow name='Items' value={`${calculations.total_items} Items`} />
                <PriceRow name='Subtotal' value={`₹${calculations.subtotal}`} />
                <PriceRow name='Discount' value={`₹${calculations.total_discount}`} />
                <PriceRow name='Tax/GST' value={`₹${calculations.total_tax}`} />
                <PriceRow name='Total' value={`₹${calculations.total}`} main />
            </div>

            <div className='rounded-sm bg-red-100 px-3 py-1'>
                <span className="text-lg font-bold">Payment</span>
                <PriceRow name='Cash' value='₹200' />
                <PriceRow name='Credit' value='₹300' />
                <PriceRow name='Cheque' value='₹150' />
                <PriceRow name='Credit/Debit Card' value='₹350' />
                <PriceRow name='Total Paid' value='₹1000' />
                <PriceRow name='Remaining' value='₹200' />
                <PriceRow name='Change' value='₹50' />
            </div>
        </div>
    )
}
