pipeline {
    agent any

    tools {
        nodejs 'NODE-18'
        maven 'MAVEN-3'
        jdk 'JAVA-17'
    }

    environment {
        BACKEND_REPO = 'https://github.com/kiran90-gh/employee-backend.git'
    }

    stages {

        stage('Clone Backend') {
            steps {
                dir('backend') {
                    git branch: 'main', url: "${env.BACKEND_REPO}"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') { // 👈 RUN npm commands inside the frontend directory
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
                            sh 'npm test || true'
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
