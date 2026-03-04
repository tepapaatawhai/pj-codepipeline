# pj-codepipeline
A [projen][] template for [code pipeline][] projects.

## Upgrades

The [upgrade workflow](https://github.com/tepapaatawhai/pj-codepipeline/actions/workflows/upgrade-main.yml)
is configured to automatically upgrade any dependencies and create a pull
requests for each upgrade available.

You can also manually upgrade the depencies by running the upgrade script

```shell
yarn run upgrade
```

projen: https://projen.io
code pipeline: https://aws.amazon.com/codepipeline/