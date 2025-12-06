import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
     if (user && user.role !== 'admin') {
       navigate('/');
     }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('activeIssues');
  const [books, setBooks] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [booksRes, membersRes, transRes] = await Promise.all([
          axios.get('http://localhost:5000/api/books', config),
          axios.get('http://localhost:5000/api/members', config),
          axios.get('http://localhost:5000/api/transactions', config)
        ]);
        setBooks(booksRes.data);
        setMemberships(membersRes.data);
        setTransactions(transRes.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getActiveIssues = () => transactions.filter(t => t.status === 'issued');
  const getOverdueReturns = () => {
    const today = new Date();
    return transactions.filter(t => {
      if (t.status !== 'issued') return false;
      const dueDate = new Date(t.returnDate);
      return dueDate < today;
    }).map(t => {
      const dueDate = new Date(t.returnDate);
      const diffTime = Math.abs(new Date() - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return { ...t, daysOverdue: diffDays, estimatedFine: diffDays * 10 };
    });
  };

  const getMembershipNo = (userId) => {
      if (!userId) return 'N/A';
      const id = typeof userId === 'object' ? userId._id : userId;
      const mem = memberships.find(m => m.memberId?._id === id || m.memberId === id);
      return mem ? mem.membershipNo : 'N/A';
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <button className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'activeIssues' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('activeIssues')}>Active Issues</button>
        <button className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'memberships' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('memberships')}>Master Memberships</button>
        <button className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'books' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('books')}>Master Books</button>
        <button className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'movies' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('movies')}>Master Movies</button>
        <button className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'overdue' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('overdue')}>Overdue Returns</button>
        <button className={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'fines' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('fines')}>Pending Fines</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="bg-white border rounded overflow-x-auto">
          {activeTab === 'activeIssues' && (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Issue ID</th>
                  <th className="py-2 px-4 border-b">Membership No</th>
                  <th className="py-2 px-4 border-b">Member Name</th>
                  <th className="py-2 px-4 border-b">Book Title</th>
                  <th className="py-2 px-4 border-b">Serial No</th>
                  <th className="py-2 px-4 border-b">Issue Date</th>
                  <th className="py-2 px-4 border-b">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {getActiveIssues().map(t => (
                  <tr key={t._id}>
                    <td className="py-2 px-4 border-b">{t._id.substring(0, 8)}...</td>
                    <td className="py-2 px-4 border-b">{getMembershipNo(t.memberId)}</td>
                    <td className="py-2 px-4 border-b">{t.memberId?.name}</td>
                    <td className="py-2 px-4 border-b">{t.bookId?.title}</td>
                    <td className="py-2 px-4 border-b">{t.bookId?.serialNumber}</td>
                    <td className="py-2 px-4 border-b">{new Date(t.issueDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{new Date(t.returnDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'memberships' && (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Membership No</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Contact</th>
                  <th className="py-2 px-4 border-b">Plan</th>
                  <th className="py-2 px-4 border-b">Start Date</th>
                  <th className="py-2 px-4 border-b">End Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map(m => (
                  <tr key={m._id}>
                    <td className="py-2 px-4 border-b">{m.membershipNo}</td>
                    <td className="py-2 px-4 border-b">{m.memberName}</td>
                    <td className="py-2 px-4 border-b">{m.contactDetails?.phone}</td>
                    <td className="py-2 px-4 border-b">{m.duration}</td>
                    <td className="py-2 px-4 border-b">{new Date(m.startDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{new Date(m.endDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'books' && (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Author</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Serial No</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {books.filter(b => b.type === 'BOOK').map(b => (
                  <tr key={b._id}>
                    <td className="py-2 px-4 border-b">{b.title}</td>
                    <td className="py-2 px-4 border-b">{b.authorOrDirector}</td>
                    <td className="py-2 px-4 border-b">{b.categoryCode}</td>
                    <td className="py-2 px-4 border-b">{b.serialNumber}</td>
                    <td className="py-2 px-4 border-b">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'movies' && (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Director</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Serial No</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {books.filter(b => b.type === 'MOVIE').map(b => (
                  <tr key={b._id}>
                    <td className="py-2 px-4 border-b">{b.title}</td>
                    <td className="py-2 px-4 border-b">{b.authorOrDirector}</td>
                    <td className="py-2 px-4 border-b">{b.categoryCode}</td>
                    <td className="py-2 px-4 border-b">{b.serialNumber}</td>
                    <td className="py-2 px-4 border-b">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'overdue' && (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Issue ID</th>
                  <th className="py-2 px-4 border-b">Membership No</th>
                  <th className="py-2 px-4 border-b">Member Name</th>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Serial No</th>
                  <th className="py-2 px-4 border-b">Due Date</th>
                  <th className="py-2 px-4 border-b">Days Overdue</th>
                  <th className="py-2 px-4 border-b">Est. Fine</th>
                </tr>
              </thead>
              <tbody>
                {getOverdueReturns().map(t => (
                  <tr key={t._id}>
                    <td className="py-2 px-4 border-b">{t._id.substring(0, 8)}...</td>
                    <td className="py-2 px-4 border-b">{getMembershipNo(t.memberId)}</td>
                    <td className="py-2 px-4 border-b">{t.memberId?.name}</td>
                    <td className="py-2 px-4 border-b">{t.bookId?.title}</td>
                    <td className="py-2 px-4 border-b">{t.bookId?.serialNumber}</td>
                    <td className="py-2 px-4 border-b">{new Date(t.returnDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-red-500">{t.daysOverdue}</td>
                    <td className="py-2 px-4 border-b text-red-500">{t.estimatedFine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'fines' && (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Issue ID</th>
                  <th className="py-2 px-4 border-b">Member Name</th>
                  <th className="py-2 px-4 border-b">Book Title</th>
                  <th className="py-2 px-4 border-b">Serial No</th>
                  <th className="py-2 px-4 border-b">Returned Date</th>
                  <th className="py-2 px-4 border-b">Fine Amount</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter(t => t.fine > 0 && !t.finePaid).map(t => (
                  <tr key={t._id}>
                    <td className="py-2 px-4 border-b">{t._id.substring(0, 8)}...</td>
                    <td className="py-2 px-4 border-b">{t.memberId?.name}</td>
                    <td className="py-2 px-4 border-b">{t.bookId?.title}</td>
                    <td className="py-2 px-4 border-b">{t.bookId?.serialNumber}</td>
                    <td className="py-2 px-4 border-b">{t.actualReturnDate ? new Date(t.actualReturnDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-red-600 font-bold">{t.fine}</td>
                    <td className="py-2 px-4 border-b text-red-600 uppercase text-xs font-semibold">Unpaid</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
