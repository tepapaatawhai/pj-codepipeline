import { cdk, javascript } from 'projen';

// TOPS-999. This package is published to DOC's own CodeArtifact repository under the
// DOC scope, not to public npm. The unscoped `pj-codepipeline` on npmjs.org is owned by
// an external maintainer, and 29 DOC repositories build on this construct; releasing
// through someone else's account is the exposure TOPS-877 closed for raindancers-cdk.
// Auth is IAM via GitHub OIDC, so there is no long-lived token.
const codeArtifactRegistry =
  'https://doc-752860630792.d.codeartifact.ap-southeast-2.amazonaws.com/npm/npm-doc/';

const project = new cdk.JsiiProject({
  author: 'MrpAcketheAd',
  authorAddress: 'andrew.frazer@raindancers.cloud',
  npmProvenance: false,
  authorOrganization: true,
  defaultReleaseBranch: 'main',
  name: '@tepapaatawhai/pj-codepipeline',
  projenrcTs: true,
  // Was pointing at tepapaatawhai/ts-cdk-pipeline-apps, which is not this repository.
  // It lands in the published package metadata, so it is corrected here.
  repositoryUrl: 'https://github.com/tepapaatawhai/pj-codepipeline.git',
  licensed: true,
  license: 'Apache-2.0',

  npmRegistryUrl: codeArtifactRegistry,
  npmAccess: javascript.NpmAccess.RESTRICTED,
  codeArtifactOptions: {
    authProvider: javascript.CodeArtifactAuthProvider.GITHUB_OIDC,
    roleToAssume: 'arn:aws:iam::752860630792:role/github-actions-codeartifact-publish',
  },

  devDeps: [
    'constructs',
    'projen',
  ],
  deps: [
    'projen',
  ],
  peerDeps: [
    'projen',
    'constructs',
  ],
  keywords: [
    'aws',
    'cdk',
  ],
  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
});

project.addGitIgnore('!projectAssets/**');

project.synth();
