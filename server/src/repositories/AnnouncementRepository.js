const BaseRepository = require('./BaseRepository');

class AnnouncementRepository extends BaseRepository {
    constructor() {
        super('announcements');
    }
}

module.exports = new AnnouncementRepository();
