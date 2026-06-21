const BaseService = require('./BaseService');
const noticeRepo = require('../repositories/NoticeRepository');

/**
 * Service class for notices (Basın Açıklamaları)
 */
class NoticeService extends BaseService {
    constructor() {
        super(noticeRepo, true);
    }
}

module.exports = new NoticeService();
