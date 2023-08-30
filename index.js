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
    const tempBucket = "mavrck-temp-build-artifacts"
    const version = core.getInput('version');
    const gitmeta = core.getInput('gitmeta');
    const gitmetaOutput = core.getInput('gitmetaOutput');
    const meta = core.getInput('meta');
    const metaOutput = core.getInput('metaOutput');
    const metrics = core.getInput('metrics');
    const metricsOutput = core.getInput('metricsOutput');
    const templateOutput = core.getInput('templateOutput');
    const template = core.getInput('template');
    const terraform = core.getInput('terraform');
    const terraformOutput = core.getInput('terraformOutput');
    const s3Path = `${bucket}/${serviceName}/${version}`;

    if (gitmeta && ( (gitmeta.headRef == "main") || (gitmeta.headRef == "master") ) ) {
      const bucketTagBranch = "MAIN";
    } else {
      const bucketTagBranch = "BRANCH";
    }

    console.log(`\n\tService name: ${serviceName}\n\tBucket: ${bucket}\n\tBucketTagBranch: ${bucketTagBranch}\n\tVersion: ${version}\n\tGitmeta: ${gitmeta}\n\tMeta: ${meta}\n\tMetrics: ${metrics}\n\tTemplateOutput: ${templateOutput}\n\tTerraform: ${terraform}\n\tTerraformOutput: ${terraformOutput}`)

    console.log("Copy to S3");

    if (gitmeta && gitmetaOutput) {
      console.log(await execShellCommand(`aws s3 cp ${gitmeta} s3://${s3Path}/${gitmetaOutput}`));
      console.log(await execShellCommand(`aws s3api put-object --bucket ${tempBucket} --key "s3://${s3Path}/${gitmetaOutput}" \
        --tagging "branch=${bucketTagBranch}" --body ${gitmeta}`));
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

    if (terraform && terraformOutput) {
            console.log(await execShellCommand(`aws s3 cp ${terraform} s3://${s3Path}/${terraformOutput}`));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
