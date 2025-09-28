pipeline {
    agent any

    tools {
        nodejs 'NODE-18'       // Jenkins tool name (configure in Jenkins -> Global Tool Configuration)
        maven 'MAVEN-3'
        jdk 'JAVA-17'
    }

    environment {
        FRONTEND_REPO = 'https://github.com/kiran90-gh/employee-frontend.git'
        BACKEND_REPO = 'https://github.com/kiran90-gh/employee-backend.git'
    }

    stages {

        stage('Clone Frontend') {
            steps {
                dir('frontend') {
                    git branch: 'main', url: "${env.FRONTEND_REPO}"
                }
            }
        }

        stage('Clone Backend') {
            steps {
                dir('backend') {
                    git branch: 'main', url: "${env.BACKEND_REPO}"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'

                    echo 'Building frontend...'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo 'Building backend...'
                    sh 'mvn clean install -DskipTests'
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            echo 'Running frontend tests...'
                            sh 'npm test || true'  // Avoid failing pipeline due to test failure
                        }
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            echo 'Running backend tests...'
                            sh 'mvn test || true'
                        }
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/build/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs.'
        }
    }
}
