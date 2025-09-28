pipeline {
    agent any

    tools {
        nodejs 'NODE-18'      // Replace with your actual NodeJS installation name
        maven 'MAVEN-3'      // Replace with your actual Maven installation name
        jdk 'JAVA-17'        // Replace with your actual JDK installation name
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
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'

                    echo 'Building frontend...'
                    sh 'npm run build' // Or your custom build command
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo 'Building backend with Maven...'
                    sh 'mvn clean package'
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            echo 'Running frontend tests...'
                            sh 'npm test'  // Replace if you have a custom test command
                        }
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
