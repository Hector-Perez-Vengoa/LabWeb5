const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Middleware
app.use(express.json()); // Para leer JSON en las solicitudes
app.use(cors()); // Permitir solicitudes de otros dominios
app.use(morgan("dev")); // detalles de cada petición

//importamos los módulos de rutas
const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

//rutas bases
app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message
    });
  }

  if (err.status === 404) {
    return res.status(404).json({
      error: 'Recurso no encontrado',
      message: err.message
    });
  }
  
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Algo salió mal'
  });
};

// Usar el middleware de manejo de errores
app.use(errorHandler);

// Mensaje de prueba en la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
