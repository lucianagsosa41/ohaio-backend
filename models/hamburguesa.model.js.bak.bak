const pool = require('../db');

const getAllHamburguesas = async () => {
  const result = await pool.query('SELECT * FROM hamburguesas ORDER BY id');
  return result.rows;
};

module.exports = {
  getAllHamburguesas,
};
