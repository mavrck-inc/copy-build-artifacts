const core = require('@actions/core');

function execShellCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        throw error
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

(async() => {
  try {
    const serviceName = core.getInput('name');
    const bucket = core.getInput('bucket');
    const version = core.getInput('version');
    const gitmeta = core.getInput('gitmeta');
    const gitmetaOutput = core.getInput('gitmetaOutput');
    const meta = core.getInput('meta');
    const metaOutput = core.getInput('metaOutput');
    const metrics = core.getInput('metrics');
    const metricsOutput = core.getInput('metricsOutput');
    const templateOutput = core.getInput('templateOutput');
    const template = core.getInput('template');
    const s3Path = `${bucket}/${serviceName}/${version}`;

    console.log(`\n\tService name: ${serviceName}\n\tBucket: ${bucket}\n\tVersion: ${version}\n\tGitmeta: ${gitmeta}\n\tMeta: ${meta}\n\tMetrics: ${metrics}\n\tTemplateOutput: ${templateOutput}`)

    console.log("Copy to S3");

    if (gitmeta && gitmetaOutput) {
      console.log(await execShellCommand(`aws s3 cp ${gitmeta} s3://${s3Path}/${gitmetaOutput}`));
    }

    if (meta && metaOutput) {
      console.log(await execShellCommand(`aws s3 cp ${meta} s3://${s3Path}/${metaOutput}`));
    }

    if (metrics && metricsOutput) {
      console.log(await execShellCommand(`aws s3 cp ${metrics} s3://${s3Path}/${metricsOutput}`));
    }

    if (templateOutput && template) {
      console.log(await execShellCommand(`aws s3 cp ${template} s3://${s3Path}/${templateOutput}`));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
