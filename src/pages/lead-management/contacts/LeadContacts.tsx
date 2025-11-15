import React, { useState } from 'react';
import { Trash2, Eye, UserPlus, Search } from 'lucide-react'; // Using lucide-react for icons

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified';
    source: string;
    value: number;
    date: string; // YYYY-MM-DD
}

// 2. Initial Sample Data
const initialLeads: Lead[] = [
    { id: 1001, name: 'Alice Johnson', email: 'alice.j@corp.com', phone: '555-0101', status: 'New', source: 'Web Form', value: 12000, date: '2025-11-01' },
    { id: 1002, name: 'Bob Smith', email: 'bob.s@biz.net', phone: '555-0102', status: 'Contacted', source: 'Referral', value: 5500, date: '2025-10-28' },
    { id: 1003, name: 'Charlie Davis', email: 'charlie.d@org', phone: '555-0103', status: 'Qualified', source: 'Cold Call', value: 24500, date: '2025-10-25' },
    { id: 1004, name: 'Diana Prince', email: 'diana.p@hero.co', phone: '555-0104', status: 'Unqualified', source: 'Email Campaign', value: 0, date: '2025-10-20' },
    { id: 1005, name: 'Ethan Hunt', email: 'e.hunt@mission.im', phone: '555-0105', status: 'New', source: 'Web Form', value: 8000, date: '2025-11-05' },
];

// Helper function to get status badge styling
const getStatusClasses = (status: Lead['status']) => {
    switch (status) {
        case 'New':
            return 'bg-blue-100 text-blue-800 border-blue-500';
        case 'Contacted':
            return 'bg-yellow-100 text-yellow-800 border-yellow-500';
        case 'Qualified':
            return 'bg-green-100 text-green-800 border-green-500';
        case 'Unqualified':
            return 'bg-red-100 text-red-800 border-red-500';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-500';
    }
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
};

const App: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<{ type: 'view' | 'delete', lead?: Lead | null }>({ type: 'view', lead: null });

    // Filter leads based on search term
    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Action Handlers ---

    const handleView = (lead: Lead) => {
        setModalContent({ type: 'view', lead });
        setIsModalOpen(true);
    };

    const handleDelete = (lead: Lead) => {
        setModalContent({ type: 'delete', lead });
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
        setIsModalOpen(false);
    };

    // --- Modal Component (Inline for Single File) ---
    const Modal: React.FC = () => {
        if (!isModalOpen || !modalContent.lead) return null;

        const lead = modalContent.lead;
        const isDelete = modalContent.type === 'delete';

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
                    <div className="p-6">
                        <h3 className={`text-xl font-bold mb-4 ${isDelete ? 'text-red-600' : 'text-gray-800'}`}>
                            {isDelete ? 'Confirm Deletion' : 'Lead Details'}
                        </h3>
                        <div className="text-sm space-y-2">
                            <p className="font-semibold text-gray-700">Name: <span className="font-normal text-gray-600">{lead.name}</span></p>
                            <p className="font-semibold text-gray-700">Email: <span className="font-normal text-gray-600">{lead.email}</span></p>
                            <p className="font-semibold text-gray-700">Phone: <span className="font-normal text-gray-600">{lead.phone}</span></p>
                            <p className="font-semibold text-gray-700">Source: <span className="font-normal text-gray-600">{lead.source}</span></p>
                            <p className="font-semibold text-gray-700">Value: <span className="font-normal text-gray-600">{formatCurrency(lead.value)}</span></p>
                        </div>

                        {isDelete && (
                            <p className="text-red-500 mt-4">Are you sure you want to delete this lead? This action cannot be undone.</p>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150"
                            >
                                {isDelete ? 'Cancel' : 'Close'}
                            </button>
                            {isDelete && (
                                <button
                                    onClick={() => confirmDelete(lead.id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-150"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Custom CSS for Mobile Responsive Table (Card View) */}
            <style>{`
        /* Apply only on mobile screens */
        @media screen and (max-width: 768px) {
            .responsive-table table {
                border: 0;
            }

            .responsive-table thead {
                clip: rect(0 0 0 0);
                height: 1px;
                margin: -1px;
                overflow: hidden;
                padding: 0;
                position: absolute;
                width: 1px;
            }

            .responsive-table tr {
                display: block;
                margin-bottom: 1rem; /* Space between cards */
                border: 1px solid #e5e7eb; /* Subtle card border */
                border-radius: 0.75rem; /* Rounded corners for cards */
                background-color: white;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            }

            .responsive-table td {
                display: block;
                text-align: right;
                padding: 0.75rem 1rem; /* Padding for mobile cells */
                padding-left: 50%; /* Make space for the label */
                position: relative;
                font-size: 0.875rem; /* sm text */
                border-bottom: 0; /* Remove borders between 'rows' in the card */
            }

            .responsive-table td::before {
                /* Custom label from data-label attribute */
                content: attr(data-label);
                position: absolute;
                left: 1rem;
                width: 45%;
                white-space: nowrap;
                text-align: left;
                font-weight: 600; /* Semibold label */
                color: #4b5563; /* Gray label text */
            }

            /* Custom styling for the "Action" column on mobile */
            .responsive-table td[data-label="Actions"] {
                text-align: center;
                padding-top: 1rem;
                padding-bottom: 1rem;
                border-top: 1px solid #f3f4f6; /* Separator line for actions */
            }
        }
      `}</style>

            {/* Header and Controls */}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
                    Lead Management Contacts ({filteredLeads.length})
                </h1>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search leads by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Add New Button */}
                    <button
                        onClick={() => alert('Add New Lead function triggered!')}
                        className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add New Lead
                    </button>
                </div>

                {/* Lead Table / Card View */}
                <div className="bg-white responsive-table shadow-xl rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden md:table-header-group">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Contact</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Source</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Value</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Date</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLeads.length === 0 ? (
                                    <tr className="bg-white hover:bg-gray-50 transition duration-150">
                                        <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" data-label="Message">
                                            No leads found matching "{searchTerm}".
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 transition duration-150">
                                            {/* ID */}
                                            <td data-label="ID" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {lead.id}
                                            </td>

                                            {/* Contact */}
                                            <td data-label="Contact" className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{lead.email}</div>
                                                <div className="text-xs text-blue-500 mt-0.5">{lead.phone}</div>
                                            </td>

                                            {/* Status */}
                                            <td data-label="Status" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                            </td>

                                            {/* Source */}
                                            <td data-label="Source" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {lead.source}
                                            </td>

                                            {/* Value */}
                                            <td data-label="Value" className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                                                {formatCurrency(lead.value)}
                                            </td>

                                            {/* Date */}
                                            <td data-label="Date" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {lead.date}
                                            </td>

                                            {/* Actions */}
                                            <td data-label="Actions" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleView(lead)}
                                                    className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-150"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-5 w-5 inline-block" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lead)}
                                                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 className="h-5 w-5 inline-block" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal />
        </div>
    );
};

export default App;