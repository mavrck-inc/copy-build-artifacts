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
    const version = process.env.VERSION;
    const gitmeta = core.getInput('gitmeta');
    const meta = core.getInput('meta');
    const metrics = core.getInput('metrics');
    const templateOutput = core.getInput('templateOutput');
    const template = core.getInput('template');
    const s3Path = `${bucket}/${serviceName}/${version}`;

    console.log(`\n\tService name: ${serviceName}\n\tBucket: ${bucket}\n\tVersion: ${version}\n\tGitmeta: ${gitmeta}\n\tMeta: ${meta}\n\tMetrics: ${metrics}\n\tTemplateOutput: ${templateOutput}`)

    console.log("Copy to S3");

    if (gitmeta) {
      console.log(await execShellCommand(`aws s3 cp ${gitmeta} s3://${s3Path}/gitMeta`));
    }

    if (meta) {
      console.log(await execShellCommand(`aws s3 cp ${meta} s3://${s3Path}/meta.yml`));
    }

    if (metrics) {
      console.log(await execShellCommand(`aws s3 cp ${metrics} s3://${s3Path}/metrics.yml`));
    }

    if (templateOutput && template) {
      console.log(await execShellCommand(`aws s3 cp ${template} s3://${s3Path}/${templateOutput}`));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
