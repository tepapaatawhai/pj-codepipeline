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
    'constructs@^10.3.0',
    'projen@0.80.9',
  ],
  deps: [
    'projen@0.80.9',
  ],
  peerDeps: [
    'projen@0.80.9',
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