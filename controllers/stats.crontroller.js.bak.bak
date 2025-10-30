const pool = require('../db');

// helpers
function parseDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s||'') ? s : null; }
function dateOrToday(s) {
  const ok = parseDate(s);
  if (ok) return ok;
  const d = new Date(); return d.toISOString().slice(0,10);
}
// arma rango desde scope
function rangeFromScope(scope='daily', dateStr) {
  const d0 = new Date(dateOrToday(dateStr));
  const start = new Date(d0);
  const end = new Date(d0);

  if (scope === 'daily') {
    end.setDate(start.getDate()+1);
  } else if (scope === 'weekly') {
    // lunes-domingo
    const day = start.getDay(); // 0=dom
    const diffToMonday = (day+6)%7;
    start.setDate(start.getDate()-diffToMonday);
    end.setDate(start.getDate()+7);
  } else { // monthly
    start.setDate(1);
    end.setMonth(start.getMonth()+1, 1);
  }
  const iso = (d)=>d.toISOString().slice(0,10);
  return { from: iso(start), to: iso(end) };
}

exports.summary = async (req, res) => {
  const scope = (req.query.scope || 'daily').toLowerCase(); // daily|weekly|monthly
  const { from, to } = rangeFromScope(scope, req.query.date);
  // rango anterior para growth
  const fromPrev = new Date(from);
  const toPrev   = new Date(to);
  const ms = toPrev - fromPrev;
  fromPrev.setTime(fromPrev.getTime() - ms);
  toPrev.setTime(toPrev.getTime() - ms);

  try {
    const q = `
      WITH cur AS (
        SELECT
          COALESCE(SUM(neto),0)::numeric(12,2)  AS neto,
          COALESCE(SUM(iva),0)::numeric(12,2)   AS iva,
          COALESCE(SUM(bruto),0)::numeric(12,2) AS bruto,
          COUNT(*)                               AS pedidos
        FROM vw_pedido_financiero
        WHERE estado IN ('paid','served')             -- cuenta ventas efectivas (ajustá si querés solo paid)
          AND fecha >= $1::date
          AND fecha <  $2::date
      ),
      prev AS (
        SELECT
          COALESCE(SUM(bruto),0)::numeric(12,2) AS bruto,
          COUNT(*)                               AS pedidos
        FROM vw_pedido_financiero
        WHERE estado IN ('paid','served')
          AND fecha >= $3::date
          AND fecha <  $4::date
      )
      SELECT
        (SELECT neto  FROM cur) AS neto,
        (SELECT iva   FROM cur) AS iva,
        (SELECT bruto FROM cur) AS bruto,
        (SELECT pedidos FROM cur) AS pedidos,
        CASE WHEN (SELECT pedidos FROM cur) > 0
          THEN ROUND((SELECT bruto FROM cur)/(SELECT pedidos FROM cur),2)
          ELSE 0 END            AS ticket_promedio,
        CASE WHEN (SELECT bruto FROM prev) = 0 THEN NULL
             ELSE ROUND( ((SELECT bruto FROM cur)-(SELECT bruto FROM prev)) / NULLIF((SELECT bruto FROM prev),0) * 100.0 , 2)
        END AS crecimiento_pct
    `;
    const r = await pool.query(q, [from, to, fromPrev.toISOString().slice(0,10), toPrev.toISOString().slice(0,10)]);
    res.json({
      scope, from, to,
      ingresos: Number(r.rows[0].bruto),           // con IVA
      pedidos: Number(r.rows[0].pedidos),
      ticket_promedio: Number(r.rows[0].ticket_promedio),
      crecimiento_pct: r.rows[0].crecimiento_pct !== null ? Number(r.rows[0].crecimiento_pct) : null,
      neto: Number(r.rows[0].neto),
      iva: Number(r.rows[0].iva)
    });
  } catch (e) {
    res.status(500).json({ message: 'Error summary', error: e.message });
  }
};

exports.series = async (req, res) => {
  const from = parseDate(req.query.from) || dateOrToday();
  const to   = parseDate(req.query.to)   || from; // si falta "to", usamos ese día
  const granularity = (req.query.granularity || 'day').toLowerCase(); // hour|day

  try {
    const bucket = granularity === 'hour'
      ? `DATE_TRUNC('hour', fecha)`
      : `DATE_TRUNC('day', fecha)`;

    const q = `
      SELECT 
        ${bucket} AS bucket,
        COALESCE(SUM(bruto),0)::numeric(12,2) AS bruto,
        COALESCE(SUM(neto),0)::numeric(12,2)  AS neto,
        COALESCE(SUM(iva),0)::numeric(12,2)   AS iva,
        COUNT(*)                               AS pedidos
      FROM vw_pedido_financiero
      WHERE estado IN ('paid','served')
        AND fecha >= $1::date
        AND fecha <  ($2::date + INTERVAL '1 day')
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    const r = await pool.query(q, [from, to]);
    res.json(r.rows.map(row => ({
      t: row.bucket, bruto: Number(row.bruto), neto: Number(row.neto), iva: Number(row.iva), pedidos: Number(row.pedidos)
    })));
  } catch (e) {
    res.status(500).json({ message: 'Error series', error: e.message });
  }
};

exports.ivaBreakdown = async (req, res) => {
  const from = parseDate(req.query.from) || dateOrToday();
  const to   = parseDate(req.query.to)   || from;

  try {
    const q = `
      SELECT 
        iva_pct,
        COALESCE(SUM(neto),0)::numeric(12,2)  AS neto,
        COALESCE(SUM(iva_monto),0)::numeric(12,2) AS iva,
        COALESCE(SUM(bruto),0)::numeric(12,2) AS bruto
      FROM vw_detalle_financiero v
      JOIN pedidos p ON p.id = v.pedido_id
      WHERE p.estado IN ('paid','served')
        AND p.fecha >= $1::date
        AND p.fecha <  ($2::date + INTERVAL '1 day')
      GROUP BY iva_pct
      ORDER BY iva_pct
    `;
    const r = await pool.query(q, [from, to]);
    res.json(r.rows.map(x => ({ iva_pct: Number(x.iva_pct), neto: Number(x.neto), iva: Number(x.iva), bruto: Number(x.bruto) })));
  } catch (e) {
    res.status(500).json({ message: 'Error IVA breakdown', error: e.message });
  }
};

exports.topProductos = async (req, res) => {
  const from  = parseDate(req.query.from) || dateOrToday();
  const to    = parseDate(req.query.to)   || from;
  const limit = Math.min(parseInt(req.query.limit || '10',10), 50);

  try {
    const q = `
      SELECT 
        v.descripcion,
        SUM(v.cantidad)::int               AS unidades,
        ROUND(SUM(v.bruto),2)::numeric(12,2) AS ventas
      FROM vw_detalle_financiero v
      JOIN pedidos p ON p.id = v.pedido_id
      WHERE p.estado IN ('paid','served')
        AND p.fecha >= $1::date
        AND p.fecha <  ($2::date + INTERVAL '1 day')
      GROUP BY v.descripcion
      ORDER BY ventas DESC
      LIMIT $3
    `;
    const r = await pool.query(q, [from, to, limit]);
    res.json(r.rows.map(x => ({ item: x.descripcion, unidades: Number(x.unidades), ventas: Number(x.ventas) })));
  } catch (e) {
    res.status(500).json({ message: 'Error top productos', error: e.message });
  }
};
