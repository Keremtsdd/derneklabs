const BaseService = require('./BaseService');
const eventRepo = require('../repositories/EventRepository');

class EventService extends BaseService {
    constructor() {
        super(eventRepo, true);
    }
}

module.exports = new EventService();
