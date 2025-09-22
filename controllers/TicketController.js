const TicketService = require("../services/TicketService");
const service = new TicketService();

exports.create = (req, res) => {
  const ticket = service.createTicket(req.body);
  res.status(201).json(ticket);
};

exports.list = (req, res) => {
  try {
    const { page, limit } = req.query;
    
    const pageNumber = page ? parseInt(page, 10) : null;
    const limitNumber = limit ? parseInt(limit, 10) : null;
    
    if (page && (isNaN(pageNumber) || pageNumber < 1)) {
      return res.status(400).json({ 
        error: "El parámetro 'page' debe ser un número entero mayor a 0" 
      });
    }
    
    if (limit && (isNaN(limitNumber) || limitNumber < 1)) {
      return res.status(400).json({ 
        error: "El parámetro 'limit' debe ser un número entero mayor a 0" 
      });
    }
    
    const result = service.list(pageNumber, limitNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Error al obtener los tickets", 
      message: error.message 
    });
  }
};

exports.assign = (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const ticket = service.assignTicket(id, user);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  res.status(200).json(ticket);
};

exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = service.changeStatus(id, status);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  res.status(200).json(ticket);
};

exports.delete = (req, res) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

exports.getNotifications = (req, res) => {
  try {
    const { id } = req.params;
    const notifications = service.getTicketNotifications(id);
    res.status(200).json({
      ticketId: id,
      notifications: notifications,
      totalNotifications: notifications.length
    });
  } catch (error) {
    if (error.message === "Ticket no encontrado") {
      return res.status(404).json({ 
        error: "Ticket no encontrado",
        message: error.message 
      });
    }
    res.status(500).json({ 
      error: "Error al obtener las notificaciones del ticket", 
      message: error.message 
    });
  }
};
