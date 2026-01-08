// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Cho phép Frontend (chạy port khác) gọi vào
app.use(cors());
app.use(express.json());

// Database giả (lưu trong RAM, tắt server là mất)
let notes = [
  { id: 1, title: 'Welcome', content: '# Xin chào\nĐây là **Markdown** note app!' }
];

// API 1: Lấy danh sách note
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// API 2: Tạo note mới
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  const newNote = {
    id: Date.now(),
    title: title || 'Không tiêu đề',
    content: content || ''
  };
  notes.push(newNote);
  res.json(newNote);
});

app.listen(PORT, () => {
  console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
});