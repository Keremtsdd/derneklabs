const pageRepo = require('../repositories/PageRepository');
const BaseService = require('./BaseService');

class PageService extends BaseService {
    constructor() {
        super(pageRepo, true);
    }
}

module.exports = new PageService();
