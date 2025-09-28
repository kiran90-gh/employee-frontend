pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'     // Replace with your actual NodeJS installation name
        maven 'Maven 3.8.5'    // Replace with your actual Maven installation name
        jdk 'JDK 17'           // Replace with your actual JDK installation name
    }

    environment {
        BACKEND_REPO = 'https://github.com/kiran90-gh/employee-backend.git'
    }

    stages {

        stage('Checkout Frontend') {
            steps {
                checkout scm
            }
        }

        stage('Clone Backend') {
            steps {
                dir('backend') {
                    git url: "${env.BACKEND_REPO}", branch: 'main'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Installing frontend dependencies...'
                sh 'npm install'

                echo 'Building frontend...'
                sh 'npm run build' // Or your custom build command
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        echo 'Running frontend tests...'
                        sh 'npm test' // Or your Angular test command
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('backend') {
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
