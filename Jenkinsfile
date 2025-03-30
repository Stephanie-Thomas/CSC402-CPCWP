pipeline {
    agent {
        label 'docker-agent-python'  // Ensure this agent has Docker Compose installed
    }
    triggers {
        pollSCM '* * * * *'  // Check every 1 min for commits
    }
    environment {
        COMPOSE_PROJECT_NAME = "jenkins-test-${BUILD_NUMBER}"  // Unique project name per build
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm  // Ensure code is checked out
            }
        }
        stage('Build & Test') {
            steps {
                script {
                    echo "Running docker-compose build and up..."
                    sh '''
                    docker compose up --build -d  # Start in detached mode
                    sleep 30  # Wait for services to initialize
                    docker compose ps  # Show running services
                    
                    '''
                }
            }
            post {
                always {
                    echo "Cleaning up containers..."
                    sh '''
                    docker compose down --volumes --remove-orphans
                    '''
                }
            }
        }
        stage('Health Check') {
            steps {
                script {
                    echo "Verifying service health..."
                    sh '''
                    # Example: Check if backend is responding
                    
                    '''
                }
            }
        }
        stage('Deliver') {
            steps {
                echo "Delivery placeholder..."
                // Add your delivery steps here
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: '**/docker-compose.log', allowEmptyArchive: true
        }
    }
}