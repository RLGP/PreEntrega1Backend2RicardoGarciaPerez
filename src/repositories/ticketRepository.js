import { ticketDBManager } from '../dao/ticketDBManager.js';
import { TicketDTO } from '../dtos/ticketDTO.js';

export class TicketRepository {
    constructor() {
        this.ticketDBManager = new ticketDBManager();
    }

    async getTicketById(id) {
        try {
            // Usar directamente el modelo de Mongoose
            const ticket = await ticketModel.findById(id).populate('products.product');
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }
            return ticket;
        } catch (error) {
            throw new Error(`Error al obtener el ticket: ${error.message}`);
        }
    }
}

export const ticketRepository = new TicketRepository();