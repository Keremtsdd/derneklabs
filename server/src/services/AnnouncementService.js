const BaseService = require('./BaseService');
const announcementRepo = require('../repositories/AnnouncementRepository');

class AnnouncementService extends BaseService {
    constructor() {
        super(announcementRepo, true);
    }
}

module.exports = new AnnouncementService();
