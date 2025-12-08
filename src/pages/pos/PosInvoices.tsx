import InvoicesTab from './components/InvoicesTab'

export default function PosInvoices() {
    return (<InvoicesTab is_draft={false} is_proforma={false} has_project={false} />)
}
