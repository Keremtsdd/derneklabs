const BaseService = require('./BaseService');
const supportTicketRepo = require('../repositories/SupportTicketRepository');

class SupportTicketService extends BaseService {
    constructor() {
        super(supportTicketRepo, false);
    }
}

module.exports = new SupportTicketService();
