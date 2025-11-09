import UserListing from './components/UserListing'
import { UserType } from '@/data/user'

export default function AdminListing() {
    return (
        <UserListing
            title='Administrator Accounts'
            subtitle='Manage who can acesss the admin panel with specific permissions'
            modifier='admin'
            user_types={[UserType.Admin]}
        />
    )
}
