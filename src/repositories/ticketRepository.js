import { ticketDBManager } from '../dao/ticketDBManager.js';
import { TicketDTO } from '../dtos/ticketDTO.js';

class TicketRepository {
    constructor() {
        this.ticketDBManager = new ticketDBManager();
    }

    async createTicket(ticket) {
        const newTicket = await this.ticketDBManager.createTicket(ticket);
        return new TicketDTO(newTicket);
    }

    async getTicketById(id) {
        const ticket = await this.ticketDBManager.getTicketById(id);
        return new TicketDTO(ticket);
    }
}

export const ticketRepository = new TicketRepository();