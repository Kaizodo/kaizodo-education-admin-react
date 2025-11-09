import UserListing from './components/UserListing'
import { UserType } from '@/data/user'

export default function ClientListing() {
    return (
        <UserListing
            title='Teachers & Employees'
            subtitle='Manage teaching and non-teaching staff'
            modifier='employee'
            user_types={[UserType.Employee, UserType.Teacher, UserType.Driver, UserType.Doctor, UserType.Nurse]} />
    )
}
