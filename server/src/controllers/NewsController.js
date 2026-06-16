const BaseController = require('./BaseController');
const NewsService = require('../services/NewsService');
const BaseDTO = require('../dtos/BaseDTO');

class NewsController extends BaseController {
    constructor() {
        super(NewsService, BaseDTO);
    }
}

module.exports = new NewsController();
