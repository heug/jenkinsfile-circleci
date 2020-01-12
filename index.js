// This is a proof of concept of converting declarative Jenkinsfiles to CircleCI 2.0 config

// The intention of this script in its current state is not to be the interface that a user will interact with, but just a POC of the conversion from Jenkinsfiles to CCI config.

const cfg = require('./util/configGen.js');
const cci = require('./util/circleci.js');
const { openFile } = require('./util/file.js');
const { verifyValid, removeComments, jenkinsfileToArray, processStages, getBalancedIndex, getSubstage } = require('./util/jenkins.js');

// TODO: Groovy library to interact with Jenkinsfiles?
// TODO: YAML Library to handle/validate output?

// TODO: Pair Jenkinsfiles syntax key with CCI syntax key

function main() {
  const config = [cfg.generateHeader(), 'version: 2.1', cci.executors()];
  const path = process.argv[2];
  const jenkinsfile = openFile(path);

  if (!verifyValid(jenkinsfile)) {
    //TODO: return error and change exit
    console.error(
      'Invalid configuration. This tool only supports Jenkinsfiles using declarative pipelines.'
    );
    exit(1);
  }



  // if valid, parse jenkinsfile

  // remove comments
  // console.log(processStages(jenkinsfileToArray(removeComments(jenkinsfile))));
  // console.log(jenkinsfileToArray(removeComments(jenkinsfile)));
  // console.log(getBalancedIndex(jenkinsfileToArray(removeComments(jenkinsfile))));
  console.log(getSubstage(jenkinsfileToArray(removeComments(jenkinsfile))));

  //TODO: write to file and return to caller
  // console.log(config.join(''));
}

main();