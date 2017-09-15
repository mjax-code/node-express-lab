const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];
let postCount = 0;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: your code to handle requests
server.get('/posts', (req, res) => {
  const term = req.query.term;
  if (term) {
    const termElements = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (post.title.search(term) !== -1 || post.contents.search(term) !== -1) {
        termElements.push(post);
      }
    }
    if (termElements.length === 0) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: `No Matching Posts for term: ${term}` });
    } else {
      res.json(termElements);
    }
  } else {
    res.json(posts);
  }
});

server.post('/posts', (req, res) => {
  const post = req.body;
  if (post && post.title && post.contents) {
    post.id = postCount++;
    posts.push(post);
    res.json(post);
  } else {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Post Missing Fields Or No Post Provided' });
    return;
  }
});

server.put('/posts', (req, res) => {
  const put = req.body;
  let changed = false;
  if (put && put.title && put.contents && put.id) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === put.id) {
        posts[i] = put;
        changed = true;
      }
    }
    if (!changed) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'Invalid ID' });
    } else {
      res.json(put);
    }
  } else {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Missing Post Info' });
  }
});

server.delete('/posts', (req, res) => {
  const del = req.body;
  let foundDel = false;
  if (del.id) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === del.id) {
        posts.splice(i, 1);
        foundDel = true;
        res.json({ success: true });
      }
    }
    if (!foundDel) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'ID not found' });
    }
  } else {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'ID Not Given' });
  }
});
module.exports = { posts, server };
