import InvoicesTab from './components/InvoicesTab'
import { useOutletContext } from 'react-router-dom'

export default function PosProformas() {
    const { organization_id } = useOutletContext<{ organization_id: number }>()
    return (<InvoicesTab organization_id={organization_id} is_draft={false} is_proforma={true} has_project={false} />)
}
