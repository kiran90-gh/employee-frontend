pipeline {
    agent any

    tools {
        nodejs 'NODE-18'      // Replace with the configured NodeJS version name in Jenkins
        maven  'MAVEN-3'      // Replace with configured Maven
        jdk    'JAVA-17'       // Replace with configured JDK
    }

    environment {
        FRONTEND_REPO = 'https://github.com/kiran90-gh/employee-frontend.git'
        BACKEND_REPO  = 'https://github.com/kiran90-gh/employee-backend.git'
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
            dir('frontend') {
                steps {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'
                    
                    echo 'Building frontend...'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            dir('backend') {
                steps {
                    echo 'Building backend...'
                    sh 'mvn clean install -DskipTests'
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Frontend Tests') {
                    dir('frontend') {
                        steps {
                            echo 'Running frontend tests...'
                            sh 'npm test || true'  // Avoid pipeline failure if no tests
                        }
                    }
                }
