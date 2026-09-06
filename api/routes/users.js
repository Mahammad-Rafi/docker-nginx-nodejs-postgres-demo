const express = require('express');
const { query } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, created_at FROM users ORDER BY id',
    );
    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

