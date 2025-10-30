// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const hamburguesasRoutes   = require('./routes/hamburguesas.routes');
const stockRoutes          = require('./routes/stock.routes');
const pedidosRoutes        = require('./routes/pedido.routes');
const detallePedidosRoutes = require('./routes/detallePedidos.routes');
const comboRoutes          = require('./routes/combo.routes');
const combosRoutes         = require('./routes/combos.routes');
const statsRoutes          = require('./routes/stats.routes');
const printerRoutes        = require('./routes/printer.routes');

// 👇 NUEVOS
const bebidasRoutes        = require('./routes/bebidas.routes');
const detalleBebidasRoutes = require('./routes/detalleBebidas.routes');

const app = express();

// Middlewares
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/api', (_req, res) => res.send('¡API de Hamburguesería funcionando! 🍔'));

// Rutas con prefijo /api
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/hamburguesas', hamburguesasRoutes);
app.use('/api/bebidas', bebidasRoutes);                    
app.use('/api/detalle-pedidos', detallePedidosRoutes);
app.use('/api/detalle-bebidas', detalleBebidasRoutes);
app.use('/api/stock', stockRoutes);            // ✅ agregado
app.use('/api/combo', comboRoutes);
app.use('/api/combos', combosRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', printerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor API en http://localhost:${PORT}`));
