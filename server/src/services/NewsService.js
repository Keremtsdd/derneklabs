const BaseService = require('./BaseService');
const newsRepo = require('../repositories/NewsRepository');

class NewsService extends BaseService {
    constructor() {
        super(newsRepo, true);
    }
}

module.exports = new NewsService();
