import * as path from 'path';
import {
  awscdk,
  SampleFile,
} from 'projen';
import { UpgradeDependenciesSchedule } from 'projen/lib/javascript';
import { Environments } from './generateenvironments';
import { Main } from './generatemain';

// TOPS-999. @tepapaatawhai packages come from DOC's CodeArtifact repository, not from
// GitHub Packages. Reading is org-scoped at the CodeArtifact end via aws:PrincipalOrgID,
// so every consumer authenticates through one shared read-only role and nothing per-repo
// has to be created in AWS.
const codeArtifactRegistry =
  'https://doc-752860630792.d.codeartifact.ap-southeast-2.amazonaws.com/npm/npm-doc/';
const codeArtifactReaderRole =
  'arn:aws:iam::752860630792:role/github-codeartifact-reader';

// Prepended to the install in every generated workflow that installs dependencies, which
// is build and upgrade. Both need it: upgrade installs exactly as build does, but runs on
// a schedule, so a missing token there surfaces days later rather than on the pull
// request.
const codeArtifactAuthSteps = [
  {
    name: 'Configure AWS credentials for CodeArtifact',
    uses: 'aws-actions/configure-aws-credentials@v4',
    with: {
      'role-to-assume': codeArtifactReaderRole,
      'aws-region': 'ap-southeast-2',
    },
  },
  {
    name: 'Authenticate to CodeArtifact',
    run: 'aws codeartifact login --tool npm --domain doc --domain-owner 752860630792 --repository npm-doc --region ap-southeast-2 --namespace tepapaatawhai',
  },
];


// The library dependencies every project built on this construct gets. They carry no
// version: each repository pins its own, because consumers sit on a wide spread of
// raindancers-cdk versions and one base construct cannot inject the right pin for all of
// them. A repository that passes its own spec for either of these keeps it.
const injectedDeps = [
  '@tepapaatawhai/depcon-cdk',
  '@tepapaatawhai/raindancers-cdk',
];

// 'name@1.2.3' -> 'name', '@scope/name@1.2.3' -> '@scope/name', 'name' -> 'name'.
function dependencyName(spec: string): string {
  const at = spec.lastIndexOf('@');
  return at > 0 ? spec.substring(0, at) : spec;
}

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
      // Merged, not replaced. Written after the spread this key would otherwise discard
      // whatever the consumer passed, which is how a repository pinning
      // '@tepapaatawhai/raindancers-cdk@0.0.175' would silently end up on a different
      // version instead - the one thing this migration is supposed not to change.
      deps: [
        ...(options.deps ?? []),
        ...injectedDeps.filter(
          (d) => !(options.deps ?? []).map(dependencyName).includes(d),
        ),
      ],
      workflowBootstrapSteps: codeArtifactAuthSteps,
      depsUpgradeOptions: {
        workflowOptions: {
          labels: ['auto-approve', 'auto-merge'],
          schedule: UpgradeDependenciesSchedule.WEEKLY,
        },

      },

    });

    // configure-aws-credentials needs an OIDC token, and projen exposes no option for
    // these jobs' permissions. `packages: read` is gone with GitHub Packages.
    this.github?.tryFindWorkflow('build')?.file?.addOverride(
      'jobs.build.permissions.id-token', 'write',
    );
    this.github?.tryFindWorkflow('upgrade')?.file?.addOverride(
      'jobs.upgrade.permissions.id-token', 'write',
    );

    // Scope mapping only. Credentials are written separately by `aws codeartifact login`,
    // which puts the token in the user-level npm config. No ${VAR} belongs here: yarn
    // fails hard on an unexpanded variable when the cache is probed before the
    // authentication step has run.
    this.npmrc.addRegistry(codeArtifactRegistry, '@tepapaatawhai');

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