const BaseController = require('./BaseController');
const DocumentService = require('../services/DocumentService');
const BaseDTO = require('../dtos/BaseDTO');

class DocumentController extends BaseController {
    constructor() {
        super(DocumentService, BaseDTO);
    }
}

module.exports = new DocumentController();
