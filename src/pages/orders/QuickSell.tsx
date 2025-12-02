import AppPage from '@/components/app/AppPage'
import QuickInvoice from './components/QuickInvoice'

export default function QuickSell() {
    return (<AppPage
        title='Quick Sell'
        subtitle="Quickly generate invoices and start selling">
        <QuickInvoice />
    </AppPage>)
}
