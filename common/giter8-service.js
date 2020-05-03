const containerService = require('./container-service');

function invokeTemplateSync(templateName) {
    const volumeMount = '-v .:/g8out:Z';
    containerService.runAttachedContainer('moredip/giter8', 'latest', [volumeMount], [templateName])
}

module.exports = {
    invokeTemplateSync
};