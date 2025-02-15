const program = require("commander");
const sync = require("@mhlabs/sfn-cli/src/commands/sync/sync");
const init = require("@mhlabs/sfn-cli/src/commands/init/init");
const inputUtil = require("../../shared/inputUtil");
program
  .command("stepfunctions")
  .alias("sfn")
  .arguments("<command>",)
  .usage("stepfunctions [init|sync] [options]")
  .description("Initiates a state machine or sets up a live sync between your local ASL and the cloud")
  .option("-t, --template-file [templateFile]", "Path to SAM template file", "template.yaml")
  .option("-s, --stack-name [stackName]", "[Only applicable when syncing] The name of the deployed stack")
  .option("-p, --profile [profile]", "[Only applicable when syncing] AWS profile to use", "default")
  .option("--region [region]", "The AWS region to use. Falls back on AWS_REGION environment variable if not specified")

  .action(async (cmd, opts) => {
    if (cmd === "init") {
      cmd.logicalId = await inputUtil.text("Name of state machine resource", "StateMachine");
      cmd.aslFile = await inputUtil.text("Path to output ASL definition file", "statemachine.yaml");
      cmd.eventSource = await inputUtil.list("Event source for state machine", ["none", "eventbridge", "api", "schedule"]);
      await init.run(opts);
    } else if (cmd === "sync") {
      await sync.run(opts);
    } else {
      console.log("Unknown command. Valid commands are: init, sync");
    }
    return;
  });
