const BaseService = require('./BaseService');
const documentRepo = require('../repositories/DocumentRepository');

class DocumentService extends BaseService {
    constructor() {
        super(documentRepo, true);
    }
}

module.exports = new DocumentService();
