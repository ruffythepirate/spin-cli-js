const sut = require('./giter8-service');

const containerService = require('./container-service');

jest.mock('./container-service');

test('invokeTemplate when called should run attached container', () => {
    const templateName = 'my template';
    const result = sut.invokeTemplateSync(templateName);
    const volumeMount = '-v .:/g8out:Z';
    expect(containerService.runAttachedContainer).toHaveBeenCalledWith('moredip/giter8', 'latest', [volumeMount], [templateName]);
});
