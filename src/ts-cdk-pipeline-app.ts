import * as path from 'path';
import {
  awscdk,
  SampleFile,
  JsonPatch,
} from 'projen';
import { UpgradeDependenciesSchedule } from 'projen/lib/javascript';
import { Environments } from './generateenvironments';
import { Main } from './generatemain';


export interface CDKPipelineAppOptions extends awscdk.AwsCdkTypeScriptAppOptions {
  /**
       * If set to true, some default values are modified compared to the settings for AwsCdkTypeScriptApp
       * Specifically, the following default values are changed:
       * - licensed is false by default
       * - githubOptions.mergify is false by default
       * @default The default is true.
       */
  readonly closedSource?: boolean;
}

/**
     * CDK code pipeline Delivered Project
     *
     * @pjid cdk-pipeline-app
     */
export class CDKPipelineApp extends awscdk.AwsCdkTypeScriptApp {
  constructor(options: CDKPipelineAppOptions) {
    super({
      licensed: options.closedSource === undefined ? false : !options.closedSource,
      githubOptions: {
        ...options.githubOptions,
        mergify: options.closedSource === undefined ? false : !options.closedSource,
      },
      ...options,
      deps: [
        '@tepapaatawhai/depcon-cdk',
        'raindancers-cdk',
      ],
      depsUpgradeOptions: {
        workflowOptions: {
          labels: ['auto-approve', 'auto-merge'],
          schedule: UpgradeDependenciesSchedule.WEEKLY,
        },

      },

    });

    // configure to use private package from Github
    const configureNode = {
      name: 'Use Node.js',
      uses: 'actions/setup-node@v4',
      with: {
        'always-auth': true,
        'node-version': '20.x',
        'registry-url': 'https://npm.pkg.github.com',
        'scope': '@tepapaatawhai',
      },
    };

    this.github?.tryFindWorkflow('build')?.file?.patch(
      // Overide the Workflow permissions...
      JsonPatch.add('/jobs/build/permissions/packages', 'read'),
      JsonPatch.add('/jobs/build/permissions/id-token', 'write'),
      JsonPatch.add('/jobs/build/steps/1/env/NODE_AUTH_TOKEN', '${{ secrets.GITHUB_TOKEN }}'),
      JsonPatch.add('/jobs/build/steps/0', configureNode),
    );

    this.npmrc.addRegistry('https://npm.pkg.github.com', '@tepapaatawhai');

    new Environments(this, './src/pipeline/environments.ts');

    new Main(this, './src/main.ts', {
      repo: 'thing/thing2',
      branch: 'main',
      codestarArn: 'arn:xxxaaaa',
    });

    new SampleFile(this, './src/exampleStack/exampleStack.ts', {
      sourcePath: path.join(__dirname, '../projectAssets/templatefiles/exampleStack.ts.template'),
    });

    new SampleFile(this, './src/pipeline/pipeline.ts', {
      sourcePath: path.join(__dirname, '../projectAssets/templatefiles/pipeline.ts.template'),
    });
  }
}