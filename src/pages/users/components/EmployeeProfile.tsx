import { useEffect, useState } from 'react';
import moment from 'moment';
import {
    Calendar,
    Phone,
    Mail
} from 'lucide-react';
import { getGenderName, getBloodGroupName, examTypeOptions, UserType } from '@/data/user';
import { ModalBody } from '@/components/common/Modal';
import {
    FaIdCard, FaPray, FaSchool,
    FaTint, FaUsers, FaUserTag, FaVenusMars
} from 'react-icons/fa';
import { LuBookHeart } from 'react-icons/lu';
import { UserService } from '@/services/UserService';
import CenterLoading from '@/components/common/CenterLoading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { nameLetter } from '@/lib/utils';

type ProfileProps = {
    id: number;
};

const EmployeeProfile = ({ id }: ProfileProps) => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const get = async () => {
        setLoading(true);
        const res = await UserService.employeeDetails(id);
        if (res.success) {
            setUserData(res.data);
        }
        setLoading(false);
    };


    const getExamTypeName = (type: number) => {
        const found = examTypeOptions.find(option => option.id === type);
        return found ? found.name : 'Unknown Exam';
    };

    useEffect(() => {
        get();
    }, [id]);




    if (!userData || loading) {
        return (<ModalBody><CenterLoading className="relative h-[400px]" /></ModalBody>)
    }




    const user = userData.user;
    const books = userData.books || [];
    const fullName = `${user.first_name} ${user.last_name}`;

    return (
        <ModalBody>
            {!loading && <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border">
                    <div className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <Avatar className="w-24 h-24 mr-3">
                            <AvatarImage src={user.image} alt={fullName} />
                            <AvatarFallback className="w-24 h-24 text-3xl flex items-center justify-center text-primary">
                                {nameLetter(fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-6">
                            <h1 className="text-2xl font-bold">{fullName}</h1>
                            <p className="text-sm">{user.designation_name || '--'} • {user.user_role_name || '--'}</p>
                        </div>
                    </div>

                    <div className='p-3'>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {!!user.gender && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaVenusMars className="mr-2 text-blue-500" />
                                    <span className="font-medium">Gender: {getGenderName(user.gender)}</span>
                                </li>
                            )}

                            {!!user.blood_group && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaTint className="mr-2 text-blue-500" />
                                    <span className="font-medium">Blood Group: {getBloodGroupName(user.blood_group)}</span>
                                </li>
                            )}
                            {!!user.religion_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaPray className="mr-2 text-blue-500" />
                                    <span className="font-medium">Religion: {user.religion_name}</span>
                                </li>
                            )}
                            {!!user.caste_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaUsers className="mr-2 text-blue-500" />
                                    <span className="font-medium">Caste: {user.caste_name}</span>
                                </li>
                            )}
                            {!!user.email && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <Mail className="mr-2 text-blue-500" />
                                    <span className="font-medium">Email: {user.email}</span>
                                </li>
                            )}

                            {!!user.mobile && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <Phone className="mr-2 text-blue-500" />
                                    <span className="font-medium">Mobile: {user.mobile}</span>
                                </li>
                            )}

                            {!!user.dob && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <Calendar className="mr-2 text-blue-500" />
                                    <span className="font-medium">DOB: {moment(user.dob).format('DD MMM, YYYY')}</span>
                                </li>
                            )}

                            {!!user.joining_date && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <Calendar className="mr-2 text-blue-500" />
                                    <span className="font-medium">Joining Date: {moment(user.joining_date).format('DD MMM, YYYY')}</span>
                                </li>
                            )}

                            {!!user.aadhar_number && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <Calendar className="mr-2 text-blue-500" />
                                    <span className="font-medium">Aadhar No: {user.aadhar_number}</span>
                                </li>
                            )}

                            {!!user.present_address && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white col-span-2" >
                                    <FaIdCard className="mr-2 text-blue-500" />
                                    <span className="font-medium">Present Address: {user.present_address}</span>
                                </li>
                            )}

                            {!!user.permanent_address && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white col-span-2">
                                    <FaIdCard className="mr-2 text-blue-500" />
                                    <span className="font-medium">Permanent Address: {user.permanent_address}</span>
                                </li>
                            )}

                            {(user.state_name || user.city_name || user.district_name || user.locality_name || user.pincode) && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white col-span-2">
                                    <FaUsers className="mr-2 text-blue-500" />
                                    <span className="font-medium">
                                        Location:&nbsp;
                                        {[user.locality_name, user.city_name, user.district_name, user.state_name]
                                            .filter(Boolean)
                                            .join(', ')}
                                        {!!user.pincode && ` - ${user.pincode}`}
                                    </span>
                                </li>
                            )}

                            {!!user.reserved_category_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaUserTag className="mr-2 text-blue-500" />
                                    <span className="font-medium">Reserved Category: {user.reserved_category_name}</span>
                                </li>
                            )}
                            {!!user.previous_organization_name && (
                                <li className="flex items-center p-3 rounded-sm shadow bg-white">
                                    <FaSchool className="mr-2 text-blue-500" />
                                    <span className="font-medium">Previous School: {user.previous_organization_name}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {user.user_type == UserType.Teacher && (
                        <div className="px-3 pb-6">
                            {/* Books Interests */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <LuBookHeart className="w-5 h-5 mr-2 text-red-600" />
                                    Books Interests
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {books.map((book: any, idx: number) => (
                                        <div key={idx} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                                            <h3 className="text-base font-semibold text-gray-800">{book.item_name}</h3>
                                            <p className="text-sm text-gray-600">Author: {book.author}</p>
                                            <p className="text-sm text-gray-600">Edition: {book.edition}</p>
                                            <div className="mt-2 text-sm text-gray-700 font-medium">
                                                Issued: <span className="text-blue-600">{book.issue_count}</span> time{book.issue_count > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Assigned Subjects */}
                            <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <FaSchool className="w-5 h-5 mr-2 text-blue-600" />
                                    Assigned Subjects
                                </h2>

                                {user.subjects && user.subjects.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {user.subjects.map((subject: any, idx: number) => (
                                            <div key={idx} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                                                <h3 className="text-base font-semibold text-gray-800">{subject.name}</h3>
                                                <p className="text-sm text-gray-600">Code: {subject.code}</p>
                                                <p className="text-sm text-gray-600">Weekly Periods: {subject.weekly_period}</p>
                                                <p className="text-sm text-gray-600">Difficulty: {subject.difficulty_level}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No subjects assigned.</p>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-10">
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Assigned Exams (Invigilator)</h2>

                                <div className="space-y-4">
                                    {userData.invigilated_exams.map((exam: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-md shadow border border-gray-200 p-4 flex justify-between items-center hover:shadow-lg transition-shadow duration-300"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold">{exam.exam_name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Class:</span> {exam.class_name || '--'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Type:</span> {getExamTypeName(exam.exam_type)}
                                                </p>
                                            </div>

                                            <span
                                                className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${exam.status === 2
                                                    ? 'bg-green-100 text-green-800'
                                                    : exam.status === 1
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {exam.status === 2
                                                    ? 'Completed'
                                                    : exam.status === 1
                                                        ? 'Published'
                                                        : 'Pending'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>}
        </ModalBody>
    );
};

export default EmployeeProfile;
