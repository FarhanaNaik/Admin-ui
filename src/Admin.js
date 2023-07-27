import React, { useState, useEffect } from 'react';
import './App.css'
const AdminUI = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    // Fetch data from the Users API
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => {
        setUsersData(data);
      });
  }, []);

  // Update the filtered data whenever searchTerm or usersData changes
  useEffect(() => {
    const filtered = usersData.filter(user => (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm) // Search by ID
    ));
    setFilteredData(filtered);
  }, [searchTerm, usersData]);

  // Pagination settings
  const usersPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / usersPerPage);

  // Get the current users to display on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset current page when searching
  };

  const handlePagination = page => {
    setCurrentPage(page);
  };

  const handleSelectRow = id => {
    const index = selectedRows.indexOf(id);
    if (index === -1) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentUsers.map(user => user.id));
    }
  };

  const handleDeleteSelected = () => {
    // Filter out the selected rows and update the state
    const remainingUsers = usersData.filter(user => !selectedRows.includes(user.id));
    setUsersData(remainingUsers);
    setSelectedRows([]);
  };

  const handleEdit = (id, field, value) => {
    setEditedData({ id, field, value });
  };

  const handleUpdate = () => {
    const updatedUsers = usersData.map(user =>
      user.id === editedData.id ? { ...user, [editedData.field]: editedData.value } : user
    );
    setUsersData(updatedUsers);
    setEditedData({});
  };

  return (
    <div className="admin-ui-container">
      <h1 className="admin-ui-heading">Admin UI</h1>
      <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search..." />
      <table className="admin-ui-table">
      
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectedRows.length === currentUsers.length} onChange={handleSelectAll} />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => handleSelectRow(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>
                {editedData.id === user.id && editedData.field === 'name' ? (
                  <input
                    type="text"
                    value={editedData.value}
                    onChange={e => setEditedData({ ...editedData, value: e.target.value })}
                  />
                ) : (
                  <span onClick={() => handleEdit(user.id, 'name', user.name)}>{user.name}</span>
                )}
              </td>
              <td>
                {editedData.id === user.id && editedData.field === 'email' ? (
                  <input
                    type="text"
                    value={editedData.value}
                    onChange={e => setEditedData({ ...editedData, value: e.target.value })}
                  />
                ) : (
                  <span onClick={() => handleEdit(user.id, 'email', user.email)}>{user.email}</span>
                )}
              </td>
              <td>
                {editedData.id === user.id && editedData.field === 'role' ? (
                  <input
                    type="text"
                    value={editedData.value}
                    onChange={e => setEditedData({ ...editedData, value: e.target.value })}
                  />
                ) : (
                  <span onClick={() => handleEdit(user.id, 'role', user.role)}>{user.role}</span>
                )}
              </td>
              <td>
                {editedData.id === user.id ?  <button className="admin-ui-update-button" onClick={handleUpdate}>Update</button> : <button className="admin-ui-update-button">Edit</button>}
              </td>
              <td>
              <button className="admin-ui-edit-button" onClick={() => handleDeleteSelected(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="admin-ui-pagination">
   
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index + 1} onClick={() => handlePagination(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      
      <button className="admin-ui-all-delete-button" onClick={handleDeleteSelected}>Delete Selected</button>
    </div>
  );
};

export default AdminUI;

