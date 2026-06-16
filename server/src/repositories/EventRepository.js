const BaseRepository = require('./BaseRepository');

class EventRepository extends BaseRepository {
    constructor() {
        super('events');
    }
}

module.exports = new EventRepository();
