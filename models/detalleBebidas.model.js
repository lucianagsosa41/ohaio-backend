const pool = require('../db'); // tu pool PG

module.exports = {
  async list() {
    const { rows } = await pool.query(`
      SELECT db.id, db.pedido_id, db.bebida_id, db.cantidad, db.unit_price,
             b.nombre AS bebida, b.precio AS precio_catalogo
      FROM detalle_bebidas db
      JOIN bebidas b ON b.id = db.bebida_id
      ORDER BY db.id DESC
    `);
    return rows;
  },

  // crea tomando el precio actual del catálogo de bebidas
  async create({ pedido_id, bebida_id, cantidad }) {
    const { rows } = await pool.query(`
      INSERT INTO detalle_bebidas (pedido_id, bebida_id, cantidad, unit_price)
      SELECT $1, $2, GREATEST($3,1), b.precio
      FROM bebidas b
      WHERE b.id = $2
      RETURNING *;
    `, [pedido_id, bebida_id, cantidad]);
    return rows[0];
  },

  async remove(id) {
    const { rowCount } = await pool.query('DELETE FROM detalle_bebidas WHERE id=$1', [id]);
    return rowCount > 0;
  },

  async findByPedidoId(pedido_id) {
    const { rows } = await pool.query(`
      SELECT db.*, b.nombre AS bebida
      FROM detalle_bebidas db
      JOIN bebidas b ON b.id=bebida_id
      WHERE pedido_id=$1
      ORDER BY db.id
    `, [pedido_id]);
    return rows;
  }
};
