import { ticketModel } from '../dao/models/ticketModel.js';  // Asegúrate de que la ruta sea correcta
import { TicketDTO } from '../dtos/ticketDTO.js';
import { ticketDBManager } from '../dao/ticketDBManager.js';

export class TicketRepository {
    constructor() {
        this.ticketDBManager = new ticketDBManager();
    }

    async getTicketById(id) {
        try {
            const ticket = await ticketModel.findById(id).populate('products.product');
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }
            return ticket;
        } catch (error) {
            throw new Error(`Error al obtener el ticket: ${error.message}`);
        }
    }

    async createTicket(ticketData) {
        try {
            const ticket = await this.ticketDBManager.createTicket(ticketData);
            return new TicketDTO(ticket);
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }
}

export const ticketRepository = new TicketRepository();