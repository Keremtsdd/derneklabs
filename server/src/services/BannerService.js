const BaseService = require('./BaseService');
const bannerRepo = require('../repositories/BannerRepository');

class BannerService extends BaseService {
    constructor() {
        super(bannerRepo, true);
    }
}

module.exports = new BannerService();
