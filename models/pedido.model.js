// models/pedido.model.js
const pool = require('../db');

// === LISTAR ===
const getAllPedidos = async () => {
  const result = await pool.query(`
    SELECT id, cliente, tipo, estado, notas, fecha, total
    FROM pedidos
    ORDER BY id DESC
  `);
  return result.rows;
};

// === CREAR ===
const createPedido = async ({ cliente = '', tipo = 'mesa', notas = null, fecha = null }) => {
  const result = await pool.query(
    `INSERT INTO pedidos (cliente, tipo, estado, notas, fecha, total)
     VALUES ($1, $2, 'pending', $3, COALESCE($4, now()), 0)
     RETURNING *`,
    [cliente, tipo, notas, fecha]
  );
  return result.rows[0];
};

// === ACTUALIZAR ===
const updatePedido = async (id, { cliente, tipo, notas, estado, fecha }) => {
  const fields = [];
  const values = [];
  let i = 1;

  if (typeof cliente === 'string') { fields.push(`cliente = $${i++}`); values.push(cliente); }
  if (typeof tipo === 'string')     { fields.push(`tipo = $${i++}`);     values.push(tipo); }
  if (typeof notas !== 'undefined') { fields.push(`notas = $${i++}`);    values.push(notas); }
  if (typeof estado === 'string')   { fields.push(`estado = $${i++}`);   values.push(estado); }
  if (typeof fecha === 'string')    { fields.push(`fecha = $${i++}`);    values.push(fecha); }

  if (!fields.length) return null;

  values.push(id);
  const q = `UPDATE pedidos SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`;
  const r = await pool.query(q, values);
  return r.rows[0] || null;
};

// === BORRAR ===
const deletePedido = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // borrar ambos tipos de detalle si no hay ON DELETE CASCADE
    await client.query(`DELETE FROM detalle_bebidas WHERE pedido_id = $1`, [id]);
    await client.query(`DELETE FROM detalle_pedidos WHERE pedido_id = $1`, [id]);
    const r = await client.query(`DELETE FROM pedidos WHERE id = $1`, [id]);
    await client.query('COMMIT');
    return r.rowCount > 0;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

// === RECALCULAR TOTAL (burgers + drinks) ===
async function recalcTotal(pedido_id) {
  const { rows } = await pool.query(
    `
    WITH sum_burgers AS (
      SELECT COALESCE(SUM(dp.cantidad * dp.unit_price), 0) AS total
        FROM detalle_pedidos dp
       WHERE dp.pedido_id = $1
    ),
    sum_drinks AS (
      SELECT COALESCE(SUM(db.cantidad * db.unit_price), 0) AS total
        FROM detalle_bebidas db
       WHERE db.pedido_id = $1
    )
    SELECT (SELECT total FROM sum_burgers) + (SELECT total FROM sum_drinks) AS total;
    `,
    [pedido_id]
  );
  const total = Number(rows[0]?.total || 0);
  await pool.query('UPDATE pedidos SET total = $1 WHERE id = $2', [total, pedido_id]);
  return total;
}

// === ARMAR DATA PARA IMPRIMIR ===
async function getPedidoForPrint(id) {
  // pedido base
  const ped = await pool.query(
    `SELECT id, cliente, notas
       FROM pedidos
      WHERE id = $1`,
    [id]
  );
  if (ped.rows.length === 0) return null;

  // detalle hamburguesas
  const detH = await pool.query(
    `SELECT h.nombre AS producto, dp.cantidad
       FROM detalle_pedidos dp
       JOIN hamburguesas h ON h.id = dp.hamburguesa_id
      WHERE dp.pedido_id = $1
      ORDER BY dp.id ASC`,
    [id]
  );

  // detalle bebidas
  const detB = await pool.query(
    `SELECT b.nombre AS producto, db.cantidad
       FROM detalle_bebidas db
       JOIN bebidas b ON b.id = db.bebida_id
      WHERE db.pedido_id = $1
      ORDER BY db.id ASC`,
    [id]
  );

  return {
    id: ped.rows[0].id,
    cliente: ped.rows[0].cliente || '',
    notas: ped.rows[0].notas || '',
    detalles: [...detH.rows, ...detB.rows],
  };
}

module.exports = {
  getAllPedidos,
  createPedido,
  updatePedido,
  deletePedido,
  recalcTotal,
  getPedidoForPrint, // 👈 export nuevo
};
