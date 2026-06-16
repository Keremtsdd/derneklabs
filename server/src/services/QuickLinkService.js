const BaseService = require('./BaseService');
const quickLinkRepo = require('../repositories/QuickLinkRepository');

class QuickLinkService extends BaseService {
    constructor() {
        super(quickLinkRepo, true);
    }
}

module.exports = new QuickLinkService();
