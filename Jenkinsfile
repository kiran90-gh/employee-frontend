pipeline {
    agent any

    tools {
        nodejs 'NODE-18'       // Your NodeJS installation name in Jenkins
        maven 'MAVEN-3'       // Your Maven installation name in Jenkins
        jdk 'JAVA-17'         // Your JDK installation name in Jenkins
    }

    environment {
        FRONTEND_REPO = 'https://github.com/kiran90-gh/employee-frontend.git'
        BACKEND_REPO = 'https://github.com/kiran90-gh/employee-backend.git'
    }

    stages {

        stage('Clone Frontend') {
            steps {
                dir('frontend') {
                    git url: "${env.FRONTEND_REPO}", branch: 'main'
                }
            }
        }

        stage('Clone Backend') {
            steps {
                dir('employee-backend/employee-management') {
                    git url: "${env.BACKEND_REPO}", branch: 'main'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend/employee-management-frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'

                    echo 'Building frontend...'
                    sh 'npm run build'  // Adjust if you use a different build command
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('employee-backend/employee-management') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend/employee-management-frontend') {
                            echo 'Running frontend tests...'
                            sh 'npm test'  // Adjust if you use a different test command
                        }
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('employee-backend/employee-management') {
                            echo 'Running backend tests...'
                            sh 'mvn test'
                        }
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
            }
        }
    }

    post {
        success {
            echo '✅ Build and tests passed.'
        }
        failure {
            echo '❌ Build failed. Check the logs above.'
        }
    }
}
