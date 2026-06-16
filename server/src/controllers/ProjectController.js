const BaseController = require('./BaseController');
const ProjectService = require('../services/ProjectService');
const BaseDTO = require('../dtos/BaseDTO');

class ProjectController extends BaseController {
    constructor() {
        super(ProjectService, BaseDTO);
    }
}

module.exports = new ProjectController();
