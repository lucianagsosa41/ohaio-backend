const pool = require('../db');

// GET /api/bebidas
exports.list = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, precio FROM bebidas ORDER BY id'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo listar bebidas' });
  }
};

// POST /api/bebidas
exports.create = async (req, res) => {
  const { nombre, precio } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO bebidas (nombre, precio) VALUES ($1, $2) RETURNING id, nombre, precio',
      [nombre, precio]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo crear bebida' });
  }
};

// PUT /api/bebidas/:id
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE bebidas SET nombre=$1, precio=$2 WHERE id=$3 RETURNING id, nombre, precio',
      [nombre, precio, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Bebida no encontrada' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo actualizar bebida' });
  }
};

// DELETE /api/bebidas/:id
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM bebidas WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo eliminar bebida' });
  }
};

