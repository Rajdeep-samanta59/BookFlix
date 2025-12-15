import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  const [activeTab, setActiveTab] = useState('books');
  const [loading, setLoading] = useState(false);

  // Books/Movies State
  const [books, setBooks] = useState([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookFormData, setBookFormData] = useState({
    title: '', authorOrDirector: '', categoryCode: '', serialNumber: '', publicationYear: '', type: 'BOOK', status: 'AVAILABLE'
  });

  // Memberships State
  const [memberships, setMemberships] = useState([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberFormData, setMemberFormData] = useState({
    memberId: '', membershipNo: '', memberName: '', 
    contactDetails: { phone: '', email: '', address: '' }, 
    duration: '6_MONTHS'
  });

  // User Management State
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    userMode: 'NEW', userId: '', name: '', password: '', role: 'user', status: 'ACTIVE'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (activeTab === 'books') {
        const { data } = await axios.get('http://localhost:5000/api/books', config);
        setBooks(data);
      } else if (activeTab === 'members') {
        const { data } = await axios.get('http://localhost:5000/api/members', config);
        setMemberships(data);
        const usersRes = await axios.get('http://localhost:5000/api/auth/users', config);
        setUsers(usersRes.data);
      } else if (activeTab === 'users') {
        const { data } = await axios.get('http://localhost:5000/api/auth/users', config);
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/books', bookFormData, config);
      setShowBookForm(false);
      fetchData();
    } catch (error) {
      toast.error('Error adding book');
    }
  };

  // Update Book State
  const [showUpdateBookForm, setShowUpdateBookForm] = useState(false);
  const [updateBookSearchSerial, setUpdateBookSearchSerial] = useState('');
  const [foundBook, setFoundBook] = useState(null);
  const [updateBookData, setUpdateBookData] = useState({
    title: '', authorOrDirector: '', categoryCode: '', serialNumber: '', publicationYear: '', type: 'BOOK'
  });

  const handleBookUpdate = async (e) => {
    e.preventDefault();
    if (!updateBookData.title || !updateBookData.authorOrDirector || !updateBookData.categoryCode || !updateBookData.serialNumber) {
        toast.error('All fields are mandatory');
        return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/books/${foundBook._id}`, updateBookData, config);
      toast.success('Book updated successfully');
      setShowUpdateBookForm(false);
      setFoundBook(null);
      setUpdateBookSearchSerial('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating book');
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/members', memberFormData, config);
      setShowMemberForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding membership');
    }
  };

  // Update Membership State
  const [showUpdateMemberForm, setShowUpdateMemberForm] = useState(false);
  const [updateSearchNo, setUpdateSearchNo] = useState('');
  const [foundMember, setFoundMember] = useState(null);
  const [updateActionData, setUpdateActionData] = useState({ memberId: '', action: 'EXTEND', duration: '6_MONTHS' });

  const handleMemberUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/members/${foundMember._id}`, updateActionData, config);
      toast.success('Membership updated successfully');
      setShowUpdateMemberForm(false);
      setFoundMember(null);
      setUpdateSearchNo('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating membership');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Note: Using register endpoint for creating users
      const emailToUse = userFormData.userId.includes('@') ? userFormData.userId : userFormData.userId + '@example.com';
      await axios.post('http://localhost:5000/api/auth/register', {
        name: userFormData.name,
        email: emailToUse,
        password: userFormData.password,
        role: userFormData.role,
        status: userFormData.status
      }, config);
      setShowUserForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error managing user');
    }
  };

  // Update User State
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [updateUserForm, setUpdateUserForm] = useState({ name: '', role: 'user', status: 'ACTIVE', email: '', password: '' });

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
       const config = { headers: { Authorization: `Bearer ${user.token}` } };
       await axios.put(`http://localhost:5000/api/auth/${foundUser._id}`, updateUserForm, config);
       toast.success('User updated successfully');
       setShowUpdateUserForm(false);
       setFoundUser(null);
       setUserSearchTerm('');
       fetchData();
    } catch (error) {
       toast.error(error.response?.data?.message || 'Error updating user');
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Maintenance</h2>
      <div className="flex space-x-4 mb-4">
        <button className={`px-4 py-2 rounded ${activeTab === 'books' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('books')}>Books/Movies</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'members' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('members')}>Memberships</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('users')}>User Management</button>
      </div>

      {/* Books/Movies Tab */}
      {activeTab === 'books' && (
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowBookForm(true)}>Add Book/Movie</button>
          {showBookForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Add Item</h3>
                <form onSubmit={handleBookSubmit}>
                  <select className="w-full mb-2 p-2 border" value={bookFormData.type} onChange={e => setBookFormData({...bookFormData, type: e.target.value})}>
                    <option value="BOOK">Book</option>
                    <option value="MOVIE">Movie</option>
                  </select>
                  <input className="w-full mb-2 p-2 border" placeholder="Title" value={bookFormData.title} onChange={e => setBookFormData({...bookFormData, title: e.target.value})} required />
                  <input className="w-full mb-2 p-2 border" placeholder="Author/Director" value={bookFormData.authorOrDirector} onChange={e => setBookFormData({...bookFormData, authorOrDirector: e.target.value})} required />
                  <input className="w-full mb-2 p-2 border" placeholder="Category Code" value={bookFormData.categoryCode} onChange={e => setBookFormData({...bookFormData, categoryCode: e.target.value})} required />
                  <input className="w-full mb-2 p-2 border" placeholder="Serial Number" value={bookFormData.serialNumber} onChange={e => setBookFormData({...bookFormData, serialNumber: e.target.value})} required />
                  <input type="number" className="w-full mb-2 p-2 border" placeholder="Publication Year" value={bookFormData.publicationYear} onChange={e => setBookFormData({...bookFormData, publicationYear: e.target.value})} />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowBookForm(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowUpdateBookForm(true)}>Update Book</button>

          {showUpdateBookForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Update Book</h3>
                {!foundBook ? (
                  <div className="mb-4">
                    <label className="block mb-2">Search Serial Number</label>
                    <div className="flex">
                      <input 
                        className="w-full p-2 border rounded-l" 
                        value={updateBookSearchSerial} 
                        onChange={e => setUpdateBookSearchSerial(e.target.value)}
                        placeholder="Enter Serial Number"
                      />
                      <button 
                        className="bg-blue-500 text-white px-4 rounded-r"
                        onClick={() => {
                          const b = books.find(book => book.serialNumber === updateBookSearchSerial);
                          if (b) {
                            setFoundBook(b);
                            setUpdateBookData({
                                title: b.title,
                                authorOrDirector: b.authorOrDirector,
                                categoryCode: b.categoryCode,
                                serialNumber: b.serialNumber,
                                publicationYear: b.publicationYear,
                                type: b.type
                            });
                          } else {
                            toast.error('Book not found');
                          }
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookUpdate}>
                    <label className="block mb-1 text-sm font-semibold">Type</label>
                    <select className="w-full mb-2 p-2 border" value={updateBookData.type} onChange={e => setUpdateBookData({...updateBookData, type: e.target.value})}>
                      <option value="BOOK">Book</option>
                      <option value="MOVIE">Movie</option>
                    </select>

                    <label className="block mb-1 text-sm font-semibold">Title</label>
                    <input className="w-full mb-2 p-2 border" placeholder="Title" value={updateBookData.title} onChange={e => setUpdateBookData({...updateBookData, title: e.target.value})} required />
                    
                    <label className="block mb-1 text-sm font-semibold">Author/Director</label>
                    <input className="w-full mb-2 p-2 border" placeholder="Author/Director" value={updateBookData.authorOrDirector} onChange={e => setUpdateBookData({...updateBookData, authorOrDirector: e.target.value})} required />
                    
                    <label className="block mb-1 text-sm font-semibold">Category Code</label>
                    <input className="w-full mb-2 p-2 border" placeholder="Category Code" value={updateBookData.categoryCode} onChange={e => setUpdateBookData({...updateBookData, categoryCode: e.target.value})} required />
                    
                    <label className="block mb-1 text-sm font-semibold">Serial Number</label>
                    <input className="w-full mb-2 p-2 border" placeholder="Serial Number" value={updateBookData.serialNumber} onChange={e => setUpdateBookData({...updateBookData, serialNumber: e.target.value})} required />
                    
                    <label className="block mb-1 text-sm font-semibold">Publication Year</label>
                    <input type="number" className="w-full mb-4 p-2 border" placeholder="Publication Year" value={updateBookData.publicationYear} onChange={e => setUpdateBookData({...updateBookData, publicationYear: e.target.value})} required />

                    <div className="flex justify-end mt-4">
                      <div className="flex-1"></div>
                      <button type="button" className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={() => { setShowUpdateBookForm(false); setFoundBook(null); setUpdateBookSearchSerial(''); }}>Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                    </div>
                  </form>
                )}
                 {!foundBook && (
                    <div className="flex justify-end">
                        <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowUpdateBookForm(false)}>Close</button>
                    </div>
                 )}
              </div>
            </div>
          )}
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Author/Director</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Serial No</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id}>
                  <td className="py-2 px-4 border-b">{book.title}</td>
                  <td className="py-2 px-4 border-b">{book.authorOrDirector}</td>
                  <td className="py-2 px-4 border-b">{book.categoryCode}</td>
                  <td className="py-2 px-4 border-b">{book.serialNumber}</td>
                  <td className="py-2 px-4 border-b">{book.type}</td>
                  <td className="py-2 px-4 border-b">{book.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Memberships Tab */}
      {activeTab === 'members' && (
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowMemberForm(true)}>Add Membership</button>
          {showMemberForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Add Membership</h3>
                <form onSubmit={handleMemberSubmit}>
                  <select className="w-full mb-2 p-2 border" value={memberFormData.memberId} onChange={e => setMemberFormData({...memberFormData, memberId: e.target.value})} required>
                    <option value="">Select User Link</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                  <input className="w-full mb-2 p-2 border" placeholder="Membership No" value={memberFormData.membershipNo} onChange={e => setMemberFormData({...memberFormData, membershipNo: e.target.value})} required />
                  <input className="w-full mb-2 p-2 border" placeholder="Member Name" value={memberFormData.memberName} onChange={e => setMemberFormData({...memberFormData, memberName: e.target.value})} required />
                  
                  <h4 className="font-bold mt-2">Contact Details</h4>
                  <input className="w-full mb-1 p-2 border" placeholder="Phone" value={memberFormData.contactDetails.phone} onChange={e => setMemberFormData({...memberFormData, contactDetails: {...memberFormData.contactDetails, phone: e.target.value}})} required />
                  <input className="w-full mb-1 p-2 border" placeholder="Email" value={memberFormData.contactDetails.email} onChange={e => setMemberFormData({...memberFormData, contactDetails: {...memberFormData.contactDetails, email: e.target.value}})} required />
                  <input className="w-full mb-2 p-2 border" placeholder="Address" value={memberFormData.contactDetails.address} onChange={e => setMemberFormData({...memberFormData, contactDetails: {...memberFormData.contactDetails, address: e.target.value}})} required />

                  <select className="w-full mb-4 p-2 border" value={memberFormData.duration} onChange={e => setMemberFormData({...memberFormData, duration: e.target.value})}>
                    <option value="6_MONTHS">6 Months</option>
                    <option value="1_YEAR">1 Year</option>
                    <option value="2_YEARS">2 Years</option>
                  </select>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowMemberForm(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}
          
             <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowUpdateMemberForm(true)}>Update Membership</button>

          {showUpdateMemberForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Update Membership</h3>
                {!foundMember ? (
                  <div className="mb-4">
                    <label className="block mb-2">Search Membership No</label>
                    <div className="flex">
                      <input 
                        className="w-full p-2 border rounded-l" 
                        value={updateSearchNo} 
                        onChange={e => setUpdateSearchNo(e.target.value)}
                        placeholder="Enter Membership No"
                      />
                      <button 
                        className="bg-blue-500 text-white px-4 rounded-r"
                        onClick={() => {
                          const m = memberships.find(mem => mem.membershipNo === updateSearchNo);
                          if (m) {
                            setFoundMember(m);
                            setUpdateActionData({ ...updateActionData, memberId: m._id });
                          } else {
                            toast.error('Membership not found');
                          }
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleMemberUpdate}>
                    <div className="mb-4 bg-gray-100 p-3 rounded text-sm">
                      <p><strong>Name:</strong> {foundMember.memberName}</p>
                      <p><strong>Status:</strong> {foundMember.status}</p>
                      <p><strong>End Date:</strong> {new Date(foundMember.endDate).toLocaleDateString()}</p>
                    </div>

                    <label className="block mb-2 font-semibold">Action</label>
                    <select 
                      className="w-full mb-4 p-2 border" 
                      value={updateActionData.action} 
                      onChange={e => setUpdateActionData({ ...updateActionData, action: e.target.value })}
                    >
                      <option value="EXTEND">Extend Membership</option>
                      <option value="CANCEL">Cancel Membership</option>
                    </select>

                    {updateActionData.action === 'EXTEND' && (
                      <>
                        <label className="block mb-2 font-semibold">Extend By</label>
                        <select 
                          className="w-full mb-4 p-2 border" 
                          value={updateActionData.duration} 
                          onChange={e => setUpdateActionData({ ...updateActionData, duration: e.target.value })}
                        >
                          <option value="6_MONTHS">6 Months (Default)</option>
                          <option value="1_YEAR">1 Year</option>
                          <option value="2_YEARS">2 Years</option>
                        </select>
                      </>
                    )}

                    <div className="flex justify-end mt-4">
                      <div className="flex-1"></div>
                      <button type="button" className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={() => { setShowUpdateMemberForm(false); setFoundMember(null); setUpdateSearchNo(''); }}>Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                    </div>
                  </form>
                )}
                 {!foundMember && (
                    <div className="flex justify-end">
                        <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowUpdateMemberForm(false)}>Close</button>
                    </div>
                 )}
              </div>
            </div>
          )}
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Membership No</th>
                <th className="py-2 px-4 border-b">Contact</th>
                <th className="py-2 px-4 border-b">Duration</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">End Date</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map(m => (
                <tr key={m._id}>
                  <td className="py-2 px-4 border-b">{m.memberName}</td>
                  <td className="py-2 px-4 border-b">{m.membershipNo}</td>
                  <td className="py-2 px-4 border-b">{m.contactDetails?.phone}</td>
                  <td className="py-2 px-4 border-b">{m.duration}</td>
                  <td className="py-2 px-4 border-b">{m.status}</td>
                  <td className="py-2 px-4 border-b">{new Date(m.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowUserForm(true)}>Add User</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 ml-4" onClick={() => setShowUpdateUserForm(true)}>Update User</button>
          {showUserForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-96">
                <h3 className="text-xl font-bold mb-4">Add User</h3>
                <form onSubmit={handleUserSubmit}>
                  {/* ... Existing Add User Form ... */}
                  <select className="w-full mb-2 p-2 border" value={userFormData.userMode} onChange={e => setUserFormData({...userFormData, userMode: e.target.value})}>
                    <option value="NEW">New User</option>
                  </select>
                  <input className="w-full mb-2 p-2 border" placeholder="User ID/Email (e.g. john@example.com)" value={userFormData.userId} onChange={e => setUserFormData({...userFormData, userId: e.target.value})} required />
                  <input className="w-full mb-2 p-2 border" placeholder="Name" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} required />
                  <input type="password" className="w-full mb-2 p-2 border" placeholder="Password" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} required />
                  <select className="w-full mb-2 p-2 border" value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowUserForm(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}

          {showUpdateUserForm && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
                 <h3 className="text-xl font-bold mb-4">Update User</h3>
                 {!foundUser ? (
                    <div className="mb-4">
                      <label className="block mb-2">Search by Name or Email</label>
                      <div className="flex">
                        <input className="w-full p-2 border rounded-l" placeholder="Enter Name or Email" value={userSearchTerm} onChange={e => setUserSearchTerm(e.target.value)} />
                        <button className="bg-blue-500 text-white px-4 rounded-r" onClick={() => {
                           const u = users.find(user => (user.name && user.name.toLowerCase().includes(userSearchTerm.toLowerCase())) || (user.email && user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) );
                           if (u) {
                              setFoundUser(u);
                              setUpdateUserForm({ name: u.name, role: u.role, status: u.status || 'ACTIVE', email: u.email, password: '' });
                           } else {
                              toast.error('User not found');
                           }
                        }}>Search</button>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowUpdateUserForm(false)}>Close</button>
                      </div>
                    </div>
                 ) : (
                    <form onSubmit={handleUserUpdate}>
                      <label className="block text-sm font-bold mb-1">Name</label>
                      <input className="w-full mb-2 p-2 border" value={updateUserForm.name} onChange={e => setUpdateUserForm({...updateUserForm, name: e.target.value})} />
                      
                      <label className="block text-sm font-bold mb-1">Email</label>
                      <input className="w-full mb-2 p-2 border bg-gray-100" value={updateUserForm.email} readOnly />

                      <label className="block text-sm font-bold mb-1">Password (Leave blank to keep same)</label>
                      <input className="w-full mb-2 p-2 border" type="password" placeholder="New Password" value={updateUserForm.password} onChange={e => setUpdateUserForm({...updateUserForm, password: e.target.value})} />

                      <label className="block text-sm font-bold mb-1">Role</label>
                      <select className="w-full mb-2 p-2 border" value={updateUserForm.role} onChange={e => setUpdateUserForm({...updateUserForm, role: e.target.value})}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>

                      <label className="block text-sm font-bold mb-1">Status</label>
                      <select className="w-full mb-4 p-2 border" value={updateUserForm.status} onChange={e => setUpdateUserForm({...updateUserForm, status: e.target.value})}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>

                      <div className="flex justify-end">
                         <button type="button" className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={() => { setFoundUser(null); setUserSearchTerm(''); }}>Back</button>
                         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                      </div>
                    </form>
                 )}
               </div>
             </div>
          )}
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email/ID</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td className="py-2 px-4 border-b">{u.name}</td>
                  <td className="py-2 px-4 border-b">{u.email}</td>
                  <td className="py-2 px-4 border-b">{u.role}</td>
                  <td className="py-2 px-4 border-b">{u.status || 'ACTIVE'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
