const BaseController = require('./BaseController');
const SupportTicketService = require('../services/SupportTicketService');
const SupportTicketDTO = require('../dtos/SupportTicketDTO');

class SupportTicketController extends BaseController {
    constructor() {
        super(SupportTicketService, SupportTicketDTO);
    }
}

module.exports = new SupportTicketController();
