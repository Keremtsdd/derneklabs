const BaseRepository = require('./BaseRepository');

class SupportTicketRepository extends BaseRepository {
    constructor() {
        super('support_tickets');
    }
}

module.exports = new SupportTicketRepository();
