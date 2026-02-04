import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'MrpAcketheAd',
  authorAddress: 'andrew.frazer@raindancers.cloud',
  npmProvenance: false,
  authorOrganization: true,
  defaultReleaseBranch: 'main',
  name: 'pj-codepipeline',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/tepapaatawhai/ts-cdk-pipeline-apps.git',
  licensed: true,
  license: 'Apache-2.0',
  jsiiVersion: '>=5.9.0',
  devDeps: [
    'constructs@^10.3.0',
    'projen@^0.99.9',
    'ts-jest@^29',
  ],
  peerDeps: [
    'projen@^0.99.9',
    'constructs@^10.3.0',
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