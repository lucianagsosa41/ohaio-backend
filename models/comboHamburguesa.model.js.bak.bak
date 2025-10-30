const pool = require('../db');

const getHamburguesasByComboId = async (combo_id) => {
  const res = await pool.query(
    `SELECT ch.*, h.nombre, h.descripcion 
     FROM combo_hamburguesa ch 
     JOIN hamburguesas h ON ch.hamburguesa_id = h.id 
     WHERE ch.combo_id = $1`,
    [combo_id]
  );
  return res.rows;
};

const addHamburguesaToCombo = async ({ combo_id, hamburguesa_id, cantidad }) => {
  const res = await pool.query(
    'INSERT INTO combo_hamburguesa (combo_id, hamburguesa_id, cantidad) VALUES ($1, $2, $3) RETURNING *',
    [combo_id, hamburguesa_id, cantidad]
  );
  return res.rows[0];
};

module.exports = {
  getHamburguesasByComboId,
  addHamburguesaToCombo,
};


