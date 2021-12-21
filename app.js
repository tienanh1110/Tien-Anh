require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Task = require('./models/task');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/api/task', (req, res) => {
  Task.find().then((result) => res.status(200).json(result));
});

app.post('/api/task', (req, res) => {
  const { title, detail } = req.body;
  if (!title.trim() || !detail.trim())
    return res.status(400).json({ error: 'Input can not be empty' });
  const task = new Task({ title, detail });
  task
    .save()
    .then(() => res.status(200).json(task))
    .catch((err) => res.status(500).json(err));
});

app.put('/api/task', (req, res) => {
  const { id, title, detail } = req.body;
  if (!title.trim() || !detail.trim()) res.sendStatus(400);
  Task.findById(id)
    .then((task) => {
      task.title = title;
      task.detail = detail;
      return task.save();
    })
    .then((task) => res.status(200).json(task))
    .catch((err) => res.status(500).json(err));
});

app.delete('/api/task', (req, res) => {
  const { id } = req.body;
  Task.deleteOne({ _id: id })
    .then(() => res.sendStatus(200))
    .catch((err) => res.status(500).json(err));
});

app.use('/', (req, res) => {
  res.sendStatus(404);
});

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
