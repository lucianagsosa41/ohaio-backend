// controllers/kitchen.controller.js
const pool = require('../db');
const { printKitchenTicket } = require('../services/printer');

const PRINTER_IP = process.env.KITCHEN_PRINTER_IP || '192.168.1.50:9100';

exports.printOrder = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ message: 'id inválido' });

  // Pedido
  const ped = await pool.query('SELECT * FROM pedidos WHERE id=$1', [id]);
  const pedido = ped.rows[0];
  if (!pedido) return res.status(404).json({ message: 'Pedido no existe' });

  // Líneas del pedido (usa snapshot de detalle_pedidos)
  const det = await pool.query(
    `SELECT COALESCE(dp.descripcion, h.nombre) AS descripcion, dp.cantidad
       FROM detalle_pedidos dp
       LEFT JOIN hamburguesas h ON h.id = dp.hamburguesa_id
      WHERE dp.pedido_id = $1
      ORDER BY dp.id`,
    [id]
  );

  if (det.rows.length === 0) {
    return res.status(400).json({ message: 'El pedido no tiene ítems' });
  }

  try {
    await printKitchenTicket({ printerIp: PRINTER_IP, order: pedido, lines: det.rows });
    res.json({ ok: true });
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
};
