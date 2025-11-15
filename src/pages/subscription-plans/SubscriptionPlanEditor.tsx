import AppPage from '@/components/app/AppPage'
import { useParams } from 'react-router-dom'
import SubscriptionPlanForm from './components/SubscriptionPlanForm';




export default function SubscriptionPlanEditor() {
    const { id } = useParams<{ id: string }>();

    return (
        <AppPage
            enableBack={true}
            title={id ? `Edit Subscription Plan` : 'Create Subscription Plan'}
            subtitle='Manage your subscription plan details'
        >
            <SubscriptionPlanForm id={id ? Number(id) : undefined} />
        </AppPage >
    )
}
