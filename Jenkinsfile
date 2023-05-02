def appname = 'storefrontsmes'
def deploy_group = 'storefrontsmes-backend-dev'
def s3_bucket = 'training-storefront-media'
def s3_filename = 'storefront-codedeploy-dev'

//Slack Notification Integration
def gitName = env.GIT_BRANCH
def jobName = env.JOB_NAME
def branchName = env.BRANCH_NAME
def main_branch = ['staging', 'develop']

// Environments Declaration
environment {
  jobName = env.JOB_NAME
  branchName = env.BRANCH_NAME
}

// Successful Build
def buildSuccess = [
  [text: "Storefront Backend Build Successful on ${branchName}",
  fallback: "Storefront Backend Build Successful on ${branchName}",
  color: "#00FF00"
  ]
]

// Failed Build
def buildError = [
  [text: "Storefront Backend Build Failed on ${branchName}",
  fallback: "Storefront Backend Build Failed on ${branchName}",
  color: "#FF0000"
  ]
]

pipeline {
  agent any

  stages {

    // stage('SonarQube Analysis') {
    //   steps {
    //     withSonarQubeEnv('SonarQube') {
    //       script {
    //         def scannerHome = tool 'SonarScanner';
    //         sh "${scannerHome}/bin/sonar-scanner"
    //       }
    //     }
    //   }
    // }

     stage('Prepare to Deploy') {
         when {
             anyOf {
                 branch 'staging'
             }
         }

       steps {
         withAWS(region:'eu-west-1',credentials:'aws-cred') {
           script {
             def gitsha = sh(script: 'git log -n1 --format=format:"%H"', returnStdout: true)
             s3_filename = "${s3_filename}-${gitsha}"
             sh """
                 aws deploy push \
                 --application-name ${appname} \
                 --description "This is a revision for the ${appname}-${gitsha}" \
                 --ignore-hidden-files \
                 --s3-location s3://${s3_bucket}/${s3_filename}.zip \
                 --source .
               """
           }
         }
       }
     }
	 stage('Deploy to Development') {
         when {
             branch 'staging'
         }
       steps {
         withAWS(region:'eu-west-1',credentials:'aws-cred') {
           script {
             sh """
                 aws deploy create-deployment \
                 --application-name ${appname} \
                 --deployment-config-name CodeDeployDefault.OneAtATime \
                 --deployment-group-name ${deploy_group} \
                 --file-exists-behavior OVERWRITE \
                 --s3-location bucket=${s3_bucket},key=${s3_filename}.zip,bundleType=zip
               """
           }
         }
	   }
	 }

    stage('Clean WS') {
      steps {
        cleanWs()
      	}
   	}
 }
 post {
    always {
      echo 'One way or another, I have finished'
      cleanWs()
    }
    success {
      script {
        if (BRANCH_NAME in main_branch) {
            slackSend(channel:"strorefront-capstone-feb", attachments: buildSuccess)
          }
      }
      withAWS(region:'eu-west-1',credentials:'aws-cred') {
        sh 'aws ses send-email --from cloudamalitech@amalitech.org --to godfred.nsabo@amalitech.com --subject "Deployment passed" --text "Storefront Backend Deployment passed"'
      		}
    }
    unstable {
      echo 'I am unstable :/'
    }
    failure {
    script {
      if (BRANCH_NAME in main_branch) {
          slackSend(channel:"strorefront-capstone-feb", attachments: buildError)
          }
    }
      withAWS(region:'eu-west-1',credentials:'aws-cred') {
        sh 'aws ses send-email --from cloudamalitech@amalitech.org --to godfred.nsabo@amalitech.com --subject "Deployment failed" --text "Storefront Backend Deployment failed"'
      		}
    }
    changed {
      echo 'Things were different before...'
    	}
  }
}
