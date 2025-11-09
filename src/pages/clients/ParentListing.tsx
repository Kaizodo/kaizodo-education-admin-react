import UserListing from './components/UserListing'
import { UserType } from '@/data/user'

export default function ParentListing() {
    return (
        <UserListing
            title='Parents Management'
            subtitle='Manage parent and guardian information'
            modifier='parent'
            user_types={[UserType.Parent]}
        />
    )
}
