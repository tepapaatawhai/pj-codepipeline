import * as path from 'path';
import { SourceCode, Project } from 'projen';


/**
 * A TypeScript interface rendered from a jsii interface specification
 */

export interface MainProps {
  readonly repo: string;
  readonly branch: string;
  readonly codestarArn: string;
}

export class Main {
  public constructor(project: Project, filepath: string, props: MainProps) {

    const sourceFile = new SourceCode(project, filepath);
    sourceFile.line('import { App } from \'aws-cdk-lib\';');
    sourceFile.line('import * as environments from \'./pipeline/environments\';');
    sourceFile.line('import { Pipeline } from \'./pipeline/pipeline\';');
    sourceFile.line('');
    sourceFile.line('const app = new App();');
    sourceFile.line('');
    sourceFile.open(`new Pipeline(app, '${path.basename(path.dirname(path.join(__dirname, '../.projen.rc')))}', {`);
    sourceFile.line('env: environments.deploy,');
    sourceFile.line(`repo: '${props.repo}',`);
    sourceFile.line(`branch: '${props.branch}',`);
    sourceFile.line(`codestarArn: '${props.codestarArn}'`);
    sourceFile.close('});');
    sourceFile.line('');
    sourceFile.line('app.synth();');

    // new SampleFile(project, filepath, { sourcePath: './build/main.ts' });


  }
}