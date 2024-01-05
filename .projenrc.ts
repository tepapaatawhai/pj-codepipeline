import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'MrpAcketheAd',
  authorAddress: 'andrew.frazer@raindancers.cloud',
  authorOrganization: true,
  defaultReleaseBranch: 'main',
  name: 'pj-codepipeline',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/tepapaatawhai/ts-cdk-pipeline-apps.git',
  licensed: true,
  license: 'Apache-2.0',
  devDeps: [
    'constructs',
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