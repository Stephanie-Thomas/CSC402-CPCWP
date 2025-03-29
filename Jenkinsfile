pipeline {
  agent {
    docker {
      image 'jenkins/agent:alpine-jdk17'
      args '-u root --network host'
      label 'docker-agent-alpine' // Must match your cloud template
    }
  }
  stages {
    stage('Setup') {
      steps {
        checkout scm
        sh 'apk add --no-cache python3'
      }
    }
    stage('Run') {
      steps {
        sh 'python3 helloworld.py'
      }
    }
  }
}