import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ currentEmployee, addOrUpdateEmployee }) => {
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
    });

    useEffect(() => {
        if (currentEmployee) {
            setEmployee(currentEmployee);
        } else {
            setEmployee({ firstName: '', lastName: '', emailId: '' });
        }
    }, [currentEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addOrUpdateEmployee(employee);
        setEmployee({ firstName: '', lastName: '', emailId: '' }); // Reset form
    };

    return (
        <div className="employee-form-container">
            <h2>{currentEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={employee.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={employee.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="emailId"
                    placeholder="Email"
                    value={employee.emailId}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{currentEmployee ? 'Update' : 'Add'}</button>
            </form>
        </div>
    );
};

export default EmployeeForm;