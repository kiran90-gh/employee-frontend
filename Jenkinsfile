pipeline {
    agent any

    tools {
        nodejs 'NODE-18'
        maven 'MAVEN-3'
        jdk 'JAVA-17'
        git 'Default' // or the name you configured
    }

    environment {
        FRONTEND_REPO = 'https://github.com/kiran90-gh/employee-frontend.git'
        BACKEND_REPO = 'https://github.com/kiran90-gh/employee-backend.git'
        AWS_REGION = 'ap-south-1'
        RDS_ENDPOINT = 'database-1.cpugiccsyl82.ap-south-1.rds.amazonaws.com'
        DB_NAME = 'employee_db'
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
                dir('employee-backend') {
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
                dir('employee-backend/employee-management') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Database Operations') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'rds-db-credentials',
                        usernameVariable: 'DB_USER',
                        passwordVariable: 'DB_PASSWORD'
                    )
                ]) {
                    script {
                        echo "Testing RDS MySQL connection..."
                        sh """
                           ./mvnw test \
                             -Dspring.datasource.url=jdbc:mysql://${RDS_ENDPOINT}:3306/${DB_NAME} \
                             -Dspring.datasource.username=${DB_USER} \
                             -Dspring.datasource.password=${DB_PASSWORD}
                        """
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend/employee-management-frontend') {
                            sh 'npm test'
                        }
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('employee-backend/employee-management') {
                            withCredentials([
                                usernamePassword(
                                    credentialsId: 'rds-db-credentials',
                                    usernameVariable: 'DB_USER',
                                    passwordVariable: 'DB_PASSWORD'
                                )
                            ]) {
                                withEnv([
                                    "RDS_ENDPOINT=${env.RDS_ENDPOINT}",
                                    "DB_NAME=${env.DB_NAME}"
                                ]) {
                                    // Spring Boot will use application-test.properties
                                    sh '''
                                        mvn test -Dspring.datasource.url=jdbc:mysql://${RDS_ENDPOINT}:3306/${DB_NAME} \
                                                 -Dspring.datasource.username=${DB_USER} \
                                                 -Dspring.datasource.password=${DB_PASSWORD} \
                                                 -Dspring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver \
                                                 -Dspring.jpa.hibernate.ddl-auto=update \
                                                 -Dspring.jpa.show-sql=true \
                                                 -Dspring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
                                    '''
                                }
                            }
                        }
                    }
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
            steps {
                script {
                    echo "Deployment stage would go here"
                }
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
        always {
            echo '📊 Build pipeline completed.'
        }
    }
}
