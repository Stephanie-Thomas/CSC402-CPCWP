pipeline {
    agent { label 'docker-agent-python' }
    triggers { pollSCM '* * * * *' }
    environment {
        COMPOSE_PROJECT_NAME = "jenkins-test-${BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }
        stage('Build & Test') {
            steps {
                echo "Running docker-compose build and up..."
                sh '''
                    docker-compose up --build -d
                    sleep 30
                    docker-compose ps
                '''
            }
            post {
                always {
                    echo "Cleaning up containers..."
                    sh 'docker-compose down --volumes --remove-orphans'
                }
            }
        }
        stage('Health Check') {
            steps {
                echo "Verifying service health..."
                sh 'curl --retry 5 --retry-delay 5 --retry-connrefused http://localhost:3001/api/health'
            }
        }
        stage('Deliver') {
            steps {
                echo "Delivery placeholder..."
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: '**/docker-compose.log', allowEmptyArchive: true
        }
    }
}
