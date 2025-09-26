import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import './App.css'; // You'll create this file next

const API_URL = 'http://localhost:8085/api/v1/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await axios.get(API_URL);
    setEmployees(response.data);
  };

  const addOrUpdateEmployee = async (employee) => {
    if (employee.id) {
      await axios.put(`${API_URL}/${employee.id}`, employee);
    } else {
      await axios.post(API_URL, employee);
    }
    fetchEmployees();
    setCurrentEmployee(null); // Clear form after submit
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchEmployees();
  };

  const editEmployee = (employee) => {
    setCurrentEmployee(employee);
  };

  return (
      <div className="App">
        <h1>Employee Management System</h1>
        <EmployeeForm
            currentEmployee={currentEmployee}
            addOrUpdateEmployee={addOrUpdateEmployee}
        />
        <EmployeeList
            employees={employees}
            onEdit={editEmployee}
            onDelete={deleteEmployee}
        />
      </div>
  );
}

export default App;
