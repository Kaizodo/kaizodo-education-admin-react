import UserListing from './components/UserListing'
import { UserType } from '@/data/user'

export default function SubscriptionPlans() {
    return (
        <UserListing
            title='Student Management'
            subtitle='Manage student records and information'
            modifier='student'
            user_types={[UserType.Student]}
        />
    )
}
