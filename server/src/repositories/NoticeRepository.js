const BaseRepository = require('./BaseRepository');

/**
 * Repository class for notices (Basın Açıklamaları)
 */
class NoticeRepository extends BaseRepository {
    constructor() {
        super('notices');
    }
}

module.exports = new NoticeRepository();
