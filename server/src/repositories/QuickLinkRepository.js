const BaseRepository = require('./BaseRepository');

class QuickLinkRepository extends BaseRepository {
    constructor() {
        super('quick_links');
    }
}

module.exports = new QuickLinkRepository();
