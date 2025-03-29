pipeline {
  agent {
    docker {
      image 'jenkins/agent:alpine-jdk17'
      args '-u root' // Temporary root access to install packages
    }
  }
  stages {
    stage('Setup') {
      steps {
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