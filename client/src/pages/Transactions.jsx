import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'availability';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Availability State
  const [searchQuery, setSearchQuery] = useState({ bookName: '', authorName: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // Issue State
  const [issueData, setIssueData] = useState({ 
    bookId: '', bookName: '', authorName: '', serialNumber: '', 
    memberId: user?._id || '', issueDate: new Date().toISOString().split('T')[0], returnDate: '', remarks: '' 
  });

  // Return State
  const [returnData, setReturnData] = useState({ transactionId: '', actualReturnDate: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (issueData.issueDate) {
      const date = new Date(issueData.issueDate);
      date.setDate(date.getDate() + 15);
      setIssueData(prev => ({ ...prev, returnDate: date.toISOString().split('T')[0] }));
    }
  }, [issueData.issueDate]);

  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (activeTab === 'availability' || activeTab === 'issue') {
        const booksRes = await axios.get('http://localhost:5000/api/books', config);
        setBooks(booksRes.data);
        const usersRes = await axios.get('http://localhost:5000/api/auth/users', config);
        setUsers(usersRes.data);
      } 
      if (activeTab === 'return' || activeTab === 'fine') {
        const transRes = await axios.get('http://localhost:5000/api/transactions', config);
        setTransactions(transRes.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.bookName && !searchQuery.authorName) {
      toast.error('Please enter Book Name or Author Name');
      return;
    }
    const results = books.filter(b => {
      const matchName = searchQuery.bookName ? b.title.toLowerCase().includes(searchQuery.bookName.toLowerCase()) : true;
      const matchAuthor = searchQuery.authorName ? b.authorOrDirector.toLowerCase().includes(searchQuery.authorName.toLowerCase()) : true;
      return matchName && matchAuthor;
    });
    setSearchResults(results);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    if (book.status === 'AVAILABLE') {
      setIssueData({
        ...issueData,
        bookId: book._id,
        bookName: book.title,
        authorName: book.authorOrDirector,
        serialNumber: book.serialNumber,
        returnDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  };

  const proceedToIssue = () => {
    if (selectedBook && selectedBook.status === 'AVAILABLE') {
      setActiveTab('issue');
      navigate('/transactions?tab=issue');
    } else {
      toast.error('Selected book is not available');
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    // Validate issue date (cannot be less than today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const issueDateObj = new Date(issueData.issueDate);
    if (issueDateObj < today) {
      toast.error('Issue Date cannot be lesser than today');
      return;
    }

    // Validate return date (max 15 days)
    const issue = new Date(issueData.issueDate);
    const ret = new Date(issueData.returnDate);
    const diffTime = Math.abs(ret - issue);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 15) {
      toast.error('Return date cannot be more than 15 days after issue date');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/transactions', {
        bookId: issueData.bookId,
        memberId: issueData.memberId,
        issueDate: issueData.issueDate,
        returnDate: issueData.returnDate,
        remarks: issueData.remarks
      }, config);
      toast.success('Book issued successfully');
      setIssueData({ ...issueData, bookId: '', memberId: '', remarks: '' });
      setActiveTab('availability');
      navigate('/transactions?tab=availability');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error issuing book');
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put(`http://localhost:5000/api/transactions/${returnData.transactionId}/return`, { actualReturnDate: returnData.actualReturnDate }, config);
      
      if (res.data.fine > 0) {
        toast('Book returned. Fine: ' + res.data.fine + '. Redirecting to Pay Fine...', { icon: '⚠️' });
      } else {
        toast.success('Book returned successfully.');
      }
      setActiveTab('fine');
      navigate('/transactions?tab=fine');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error returning book');
    }
  };

  const handlePayFine = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/transactions/${id}/payfine`, {}, config);
      toast.success('Fine paid successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error paying fine');
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <div className="flex space-x-4 mb-4">
        <button className={`px-4 py-2 rounded ${activeTab === 'availability' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => { setActiveTab('availability'); navigate('/transactions?tab=availability'); }}>Check Availability</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'issue' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => { setActiveTab('issue'); navigate('/transactions?tab=issue'); }}>Issue Book</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'return' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => { setActiveTab('return'); navigate('/transactions?tab=return'); }}>Return Book</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'fine' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => { setActiveTab('fine'); navigate('/transactions?tab=fine'); }}>Pay Fine</button>
      </div>

      {activeTab === 'availability' && (
        <div>
          <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
            <input className="p-2 border" placeholder="Book Name" value={searchQuery.bookName} onChange={e => setSearchQuery({...searchQuery, bookName: e.target.value})} />
            <input className="p-2 border" placeholder="Author Name" value={searchQuery.authorName} onChange={e => setSearchQuery({...searchQuery, authorName: e.target.value})} />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
          </form>
          
          {searchResults.length > 0 && (
            <div>
              <table className="min-w-full bg-white border mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Select</th>
                    <th className="py-2 px-4 border-b">Title</th>
                    <th className="py-2 px-4 border-b">Author</th>
                    <th className="py-2 px-4 border-b">Serial No</th>
                    <th className="py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map(b => (
                    <tr key={b._id}>
                      <td className="py-2 px-4 border-b text-center">
                        <input type="radio" name="selectedBook" disabled={b.status !== 'AVAILABLE'} onChange={() => handleSelectBook(b)} />
                      </td>
                      <td className="py-2 px-4 border-b">{b.title}</td>
                      <td className="py-2 px-4 border-b">{b.authorOrDirector}</td>
                      <td className="py-2 px-4 border-b">{b.serialNumber}</td>
                      <td className="py-2 px-4 border-b">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={proceedToIssue} className="bg-green-500 text-white px-4 py-2 rounded" disabled={!selectedBook || selectedBook.status !== 'AVAILABLE'}>Proceed to Issue</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'issue' && (
        <form onSubmit={handleIssue} className="bg-white p-6 rounded shadow max-w-lg">
          <div className="mb-4">
            <label className="block mb-2">Book Name</label>
            <input className="w-full p-2 border bg-gray-100" value={issueData.bookName} readOnly placeholder="Select from Availability tab" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Author</label>
            <input className="w-full p-2 border bg-gray-100" value={issueData.authorName} readOnly />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Serial Number</label>
            <input className="w-full p-2 border bg-gray-100" value={issueData.serialNumber} readOnly />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Issue Date</label>
            <input type="date" className="w-full p-2 border" value={issueData.issueDate} onChange={e => setIssueData({...issueData, issueDate: e.target.value})} required />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Return Date (Max 15 days)</label>
            <input type="date" className="w-full p-2 border" value={issueData.returnDate} onChange={e => setIssueData({...issueData, returnDate: e.target.value})} required />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Remarks (Optional)</label>
            <textarea 
              className="w-full p-2 border" 
              placeholder="Enter remarks here..." 
              value={issueData.remarks} 
              onChange={e => setIssueData({...issueData, remarks: e.target.value})}
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Confirm Issue</button>
        </form>
      )}

      {activeTab === 'return' && (
        <form onSubmit={handleReturn} className="bg-white p-6 rounded shadow max-w-lg">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select Issued Book</label>
            <select 
              className="w-full p-2 border rounded" 
              value={returnData.transactionId} 
              onChange={e => {
                const tId = e.target.value;
                const t = transactions.find(tr => tr._id === tId);
                setReturnData({ 
                  transactionId: tId, 
                  actualReturnDate: t ? new Date(t.returnDate).toISOString().split('T')[0] : '' 
                });
              }} 
              required
            >
              <option value="">Select Transaction</option>
              {transactions.filter(t => t.status === 'issued').map(t => (
                <option key={t._id} value={t._id}>{t.bookId?.title} (Due: {new Date(t.returnDate).toLocaleDateString()})</option>
              ))}
            </select>
          </div>

          {returnData.transactionId && (() => {
            const t = transactions.find(tr => tr._id === returnData.transactionId);
            if (!t) return null;
            return (
              <>
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600">Name of Book</label>
                  <input className="w-full p-2 border bg-gray-100 rounded text-gray-700" value={t.bookId?.title || ''} readOnly />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600">Author Name</label>
                  <input className="w-full p-2 border bg-gray-100 rounded text-gray-700" value={t.bookId?.authorOrDirector || ''} readOnly />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600">Serial No <span className="text-red-500">*</span></label>
                  <input className="w-full p-2 border bg-gray-100 rounded text-gray-700" value={t.bookId?.serialNumber || ''} readOnly />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600">Issue Date</label>
                  <input className="w-full p-2 border bg-gray-100 rounded text-gray-700" value={new Date(t.issueDate).toLocaleDateString()} readOnly />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 font-semibold">Return Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
                    value={returnData.actualReturnDate} 
                    onChange={e => setReturnData({...returnData, actualReturnDate: e.target.value})} 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1"> </p>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                  Confirm Return
                </button>
              </>
            );
          })()}
        </form>
      )}

      {activeTab === 'fine' && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Member</th>
              <th className="py-2 px-4 border-b">Book</th>
              <th className="py-2 px-4 border-b">Fine Amount</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.filter(t => t.fine > 0 && !t.finePaid).map(t => (
              <tr key={t._id}>
                <td className="py-2 px-4 border-b">{t.memberId?.name}</td>
                <td className="py-2 px-4 border-b">{t.bookId?.title}</td>
                <td className="py-2 px-4 border-b">{t.fine}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handlePayFine(t._id)}>Pay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
