import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // URL Backend của bạn
  const API_URL = 'http://localhost:3000/api/notes';

  // Load danh sách note khi mở web
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data);
    } catch (error) {
      console.error("Không kết nối được Backend:", error);
    }
  };

  const handleSave = async () => {
    if (!title && !content) return alert("Viết gì đó đi bạn ơi!");
    
    setLoading(true);
    try {
      await axios.post(API_URL, { title, content });
      await fetchNotes(); // Load lại danh sách mới
      handleNew(); // Reset form
    } catch (error) {
      alert('Lỗi lưu note. Kiểm tra xem Backend chạy chưa?');
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setTitle('');
    setContent('');
  };

  const handleSelectNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="app-container">
      {/* Cột trái: Danh sách */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>📒 My Notes</h2>
          <button className="btn-new" onClick={handleNew}>+ Tạo Mới</button>
        </div>
        <div className="note-list">
          {notes.length === 0 && <p style={{textAlign: 'center', color: '#888'}}>Chưa có note nào</p>}
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="note-item" 
              onClick={() => handleSelectNote(note)}
            >
              <strong>{note.title}</strong>
              <p>{note.content.substring(0, 30)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Editor & Preview */}
      <div className="main-content">
        <div className="editor-section">
          <input 
            className="input-title"
            placeholder="Tiêu đề bài viết..." 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
          <textarea
            className="input-content"
            placeholder="Viết nội dung Markdown tại đây..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button className="btn-save" onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : '💾 Lưu Note'}
          </button>
        </div>

        <div className="preview-section">
          <div className="preview-header">Xem trước (Preview)</div>
          <div className="markdown-body">
            {content ? <ReactMarkdown>{content}</ReactMarkdown> : <em style={{color:'#ccc'}}>Nội dung hiển thị ở đây...</em>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;