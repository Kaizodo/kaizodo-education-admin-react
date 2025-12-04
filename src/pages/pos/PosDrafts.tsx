import InvoicesTab from './components/InvoicesTab'
import { useOutletContext } from 'react-router-dom'

export default function PosDrafts() {
    const { organization_id } = useOutletContext<{ organization_id: number }>()
    return (<InvoicesTab organization_id={organization_id} is_draft={true} is_proforma={false} has_project={false} />)
}
