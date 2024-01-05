import { CDKPipelineApp } from '../src';

describe('Check settings specific for project type', () => {
  test('Mergify is not enabled for closedSource default', () => {
    const project = new CDKPipelineApp({
      cdkVersion: '2.117.0',
      defaultReleaseBranch: 'main',
      name: 'myproject',
    });

    const hasNoMergifyConfig = project.github && !project.github?.mergify;
    expect(hasNoMergifyConfig).toBeTruthy();
  });
});