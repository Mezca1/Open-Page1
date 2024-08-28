const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const ideasFilePath = path.join(__dirname, 'ideas.json');

// 读取ideas.json文件中的数据
let ideas = [];
try {
  if (fs.existsSync(ideasFilePath)) {
    const data = fs.readFileSync(ideasFilePath, 'utf8');
    ideas = JSON.parse(data);
  }
} catch (err) {
  console.error('Failed to read ideas file:', err);
}

// 获取所有ideas
app.get('/api/ideas', (req, res) => {
  res.json(ideas);
});

// 提交新的idea
app.post('/api/ideas', (req, res) => {
  const idea = req.body.idea;
  if (!idea) {
    return res.status(400).json({ message: 'Idea is required' });
  }
  ideas.push(idea);
  // 将ideas写入ideas.json文件
  fs.writeFile(ideasFilePath, JSON.stringify(ideas, null, 2), (err) => {
    if (err) {
      console.error('Failed to write ideas file:', err);
      return res.status(500).json({ message: 'Failed to save idea' });
    }
    res.status(201).json({ message: 'Idea submitted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
