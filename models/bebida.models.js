const db = require('../db');

async function getAllBebidas() {
  const { rows } = await db.query('SELECT id, nombre, precio FROM bebidas ORDER BY nombre ASC');
  return rows;
}

async function findBebidaById(id) {
  const { rows } = await db.query('SELECT id, nombre, precio FROM bebidas WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updatePrecio(id, precio) {
  const { rows } = await db.query(
    'UPDATE bebidas SET precio = $1 WHERE id = $2 RETURNING id, nombre, precio',
    [precio, id]
  );
  return rows[0] || null;
}

module.exports = { getAllBebidas, findBebidaById, updatePrecio };
