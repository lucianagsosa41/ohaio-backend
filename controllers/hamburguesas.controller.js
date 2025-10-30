const Hamburguesa = require('../models/hamburguesa.model');

const getHamburguesas = async (req, res) => {
  try {
    const hamburguesas = await Hamburguesa.getAllHamburguesas();
    res.json(hamburguesas);
  } catch (error) {
    console.error('Error al obtener hamburguesas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getHamburguesas,
};
