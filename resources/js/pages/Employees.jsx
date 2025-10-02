import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees');
            setEmployees(response.data.employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await api.post('/employees', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '' });
            fetchEmployees();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: error.response?.data?.message || 'Failed to create employee' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;

        try {
            await api.delete(`/employees/${id}`);
            fetchEmployees();
        } catch (error) {
            alert('Failed to delete employee');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await api.put(`/employees/${id}`, { is_active: !currentStatus });
            fetchEmployees();
        } catch (error) {
            alert('Failed to update employee status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage your organization's employees
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Employee
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {employees.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-3 py-4 text-sm text-gray-500 text-center">
                                                No employees yet. Click "Add Employee" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        employees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{employee.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {employee.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <button
                                                        onClick={() => toggleActive(employee.id, employee.is_active)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        {employee.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
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
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Employee</h3>
                                <form onSubmit={handleSubmit}>
                                    {errors.general && (
                                        <div className="mb-4 rounded-md bg-red-50 p-4">
                                            <p className="text-sm text-red-800">{errors.general}</p>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                                    </div>

                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                                        >
                                            {submitting ? 'Creating...' : 'Create Employee'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </Layout>
    );
};

export default Employees;
