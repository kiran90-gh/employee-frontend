pipeline {
    agent any

    tools {
        nodejs 'NODE-18'
        maven 'MAVEN-3'
        jdk 'JAVA-17'
    }

    environment {
        FRONTEND_REPO = 'https://github.com/kiran90-gh/employee-frontend.git'
        BACKEND_REPO  = 'https://github.com/kiran90-gh/employee-backend.git'
        AWS_REGION    = 'ap-south-1'
        RDS_ENDPOINT  = 'database-1.cpugiccsyl82.ap-south-1.rds.amazonaws.com'
        DB_NAME       = 'employee_db'
        // Sonar Related environment (if needed)
        SONAR_PROJECT_KEY = 'my-projects'
        SONAR_HOST = 'http://52.66.221.120/:9000'
    }

    stages {
        stage('Configure AWS') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-rds-credentials') {
                    script {
                        echo "Connected to AWS region: ${AWS_REGION}"
                        echo "RDS Endpoint: ${RDS_ENDPOINT}"
                    }
                }
            }
        }

        stage('Clone Frontend') {
            steps {
                dir('frontend') {
                    git url: "${env.FRONTEND_REPO}", branch: 'main'
                }
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
                dir('frontend/employee-management-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend/employee-management') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend/employee-management-frontend') {
                            // optionally generate coverage report here
                            sh 'npm test -- --coverage'
                        }
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('backend/employee-management') {
                            withCredentials([usernamePassword(
                                credentialsId: 'rds-db-credentials',
                                usernameVariable: 'DB_USER',
                                passwordVariable: 'DB_PASSWORD'
                            )]) {
                                withEnv([
                                    "RDS_ENDPOINT=${env.RDS_ENDPOINT}",
                                    "DB_NAME=${env.DB_NAME}"
                                ]) {
                                    sh '''
                                        mvn test \
                                            -Dspring.datasource.url=jdbc:mysql://${RDS_ENDPOINT}:3306/${DB_NAME} \
                                            -Dspring.datasource.username=${DB_USER} \
                                            -Dspring.datasource.password=${DB_PASSWORD} \
                                            -Dspring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver \
                                            -Dspring.jpa.hibernate.ddl-auto=update \
                                            -Dspring.jpa.show-sql=true \
                                            -Dspring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Use the SonarQube Jenkins plugin
                withSonarQubeEnv('MySonarQubeServer') { 
                    script {
                        // If you want to scan both frontend & backend in one sonar analysis
                        sh """
                            # For backend (Java), using Maven
                            cd backend/employee-management
                            mvn sonar:sonar \
                              -Dsonar.projectKey=employee-backend \
                              -Dsonar.sources=src/main/java \
                              -Dsonar.tests=src/test/java \
                              -Dsonar.host.url=$SONAR_HOST_URL \
                              -Dsonar.login=$SONAR_AUTH_TOKEN
                        """
                        sh """
                            # For frontend (NodeJS)
                            cd ../../frontend/employee-management-frontend
                            # If using sonar-scanner CLI
                            sonar-scanner \
                              -Dsonar.projectKey=employee-frontend \
                              -Dsonar.sources=src \
                              -Dsonar.tests=src \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                              -Dsonar.host.url=$SONAR_HOST_URL \
                              -Dsonar.login=$SONAR_AUTH_TOKEN
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/employee-management-frontend/build/**/*', fingerprint: true
            }
        }

        stage('Deploy') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    echo "🚀 Deployment stage would go here"
                    // your deploy steps
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build, tests, Sonar analysis, and quality gate passed.'
        }
        failure {
            echo '❌ One of the stages failed. Check logs for sonar quality gate or other errors.'
        }
        always {
            echo '📊 Pipeline completed.'
        }
    }
}
