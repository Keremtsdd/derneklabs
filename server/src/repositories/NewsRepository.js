const BaseRepository = require('./BaseRepository');

class NewsRepository extends BaseRepository {
    constructor() {
        super('news');
    }
}

module.exports = new NewsRepository();
