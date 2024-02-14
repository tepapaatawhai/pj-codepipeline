import { SourceCode, SampleFile, Project } from 'projen';

//import fs from 'fs';
/**
 * A TypeScript interface rendered from a jsii interface specification
 */
export class Environments {
  public constructor(project: Project, filepath: string) {

    const environments = [
      {
        name: 'dev',
        env: {
          account: '22222222222',
          region: 'ap-southeast-2',
        },
      },
      {
        name: 'deploy',
        env: {
          account: '111111111111',
          region: 'ap-southeast-2',
        },
      },
    ];


    const sourceFile = new SourceCode(project, './build/environments.ts' );
    sourceFile.line('import * as core from \'aws-cdk-lib\';');
    environments.forEach((environment) => {
      sourceFile.line(`export const ${environment.name}: core.Environment = ${JSON.stringify(environment.env, undefined, 2)};`);
      sourceFile.line('');
    });

    new SampleFile(project, filepath, { sourcePath: './build/environments.ts' });


  }
}