import * as core from 'aws-cdk-lib';

import * as constructs from 'constructs';

export interface ExampleStackProps extends core.StackProps {
  name: string;
}

export class ExampleStack extends core.Stack {

  constructor(scope: constructs.Construct, id: string, props: ExampleStackProps) {
    super(scope, id, props);


    // include some meaningful things.

    new core.CfnOutput(this, 'name', {
      value: props.name,
    });


  }
}