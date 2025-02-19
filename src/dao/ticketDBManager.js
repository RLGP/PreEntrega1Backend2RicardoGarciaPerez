import { ticketModel } from './models/ticketModel.js';

class ticketDBManager {
    async createTicket(ticket) {
        return await ticketModel.create(ticket);
    }

    async getTicketById(id) {
        return await ticketModel.findById(id).populate('products.product');
    }
}

export { ticketDBManager };