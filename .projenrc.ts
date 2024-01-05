import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'afrazeradm',
  authorAddress: 'afrazeradm@doc.govt.nz',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'pj-codepipeline',
  projenrcTs: true,
  repositoryUrl: 'https://git.us-west-2.github.source.3p.codecatalyst.aws/v1/depcon-codecatalyst/pj-projen/pj-codepipeline',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();