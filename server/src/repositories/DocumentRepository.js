const BaseRepository = require('./BaseRepository');

class DocumentRepository extends BaseRepository {
    constructor() {
        super('documents');
    }
}

module.exports = new DocumentRepository();
