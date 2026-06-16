const BaseRepository = require('./BaseRepository');

class BannerRepository extends BaseRepository {
    constructor() {
        super('banners');
    }
}

module.exports = new BannerRepository();
