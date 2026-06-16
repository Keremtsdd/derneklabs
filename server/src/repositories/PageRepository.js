const BaseRepository = require('./BaseRepository');

class PageRepository extends BaseRepository {
    constructor() {
        super('pages');
    }
}

module.exports = new PageRepository();
