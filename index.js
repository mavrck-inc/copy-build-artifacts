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

    console.log(`\n\tService name: ${serviceName}\n\tBucket: ${bucket}\n\tVersion: ${version}\n\tGitmeta: ${gitmeta}\n\tMeta: ${meta}\n\tMetrics: ${metrics}`)

    if (gitmeta) {
      console.log(await execShellCommand(`aws s3 cp ${gitmeta} s3://${bucket}/${serviceName}/${version}/gitMeta`));
    }
    if (meta) {
      console.log(await execShellCommand(`aws s3 cp ${meta} s3://${bucket}/${serviceName}/${version}/meta.yml`));
    }

    if (metrics) {
      console.log(await execShellCommand(`aws s3 cp ${metrics} s3://${bucket}/${serviceName}/${version}/metrics.yml`));
    }

  } catch (error) {
    core.setFailed(error.message);
  }
})();
