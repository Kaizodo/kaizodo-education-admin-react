import InvoicesTab from './components/InvoicesTab'
import { useOutletContext } from 'react-router-dom'

export default function PosInvoices() {
    const { organization_id } = useOutletContext<{ organization_id: number }>()
    return (<InvoicesTab organization_id={organization_id} is_draft={false} is_proforma={false} has_project={false} />)
}
