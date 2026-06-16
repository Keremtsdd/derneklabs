const BaseService = require('./BaseService');
const projectRepo = require('../repositories/ProjectRepository');

class ProjectService extends BaseService {
    constructor() {
        super(projectRepo, true);
    }
}

module.exports = new ProjectService();
