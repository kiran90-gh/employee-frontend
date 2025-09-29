pipeline {
    agent any

    tools {
        nodejs 'NODE-18'
        maven 'MAVEN-3'
        jdk 'JAVA-17'
    }

    environment {
        FRONTEND_REPO     = 'https://github.com/kiran90-gh/employee-frontend.git'
        BACKEND_REPO      = 'https://github.com/kiran90-gh/employee-backend.git'
        AWS_REGION        = 'ap-south-1'
        RDS_ENDPOINT      = 'database-1.cpugiccsyl82.ap-south-1.rds.amazonaws.com'
        DB_NAME           = 'employee_db'
        SONAR_AUTH_TOKEN  = 'squ_a3456e28ff7723fb19bdb4370d15bfb641901189'
        SONAR_HOST_URL    = 'http://52.66.221.120:9000'
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
                            // generate coverage if possible
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
                withSonarQubeEnv('MySonarQubeServer') {
                    script {
                        def scannerHome = tool 'SonarScanner'

                        // Backend (Java) analysis
                        dir('backend/employee-management') {
                            sh """
                              mvn sonar:sonar \
                                -Dsonar.projectKey=employee-backend \
                                -Dsonar.sources=src/main/java \
                                -Dsonar.tests=src/test/java \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.token=${SONAR_AUTH_TOKEN}
                            """
                        }

                        // Frontend (JS/TS) analysis
                        dir('frontend/employee-management-frontend') {
                          sh """
                          ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=employee-frontend \
                          -Dsonar.sources=src \
                          -Dsonar.tests=  \
                          -Dsonar.exclusions=**/build/**,**/dist/**,**/*.spec.js,**/*.test.js \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.token=${SONAR_AUTH_TOKEN}
                           """
                        }
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
                echo "🚀 Deployment logic goes here"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded: build, tests, and quality gate passed.'
        }
        failure {
            echo '❌ Pipeline failed — check logs for errors or quality gate failures.'
        }
        always {
            echo '📊 Pipeline finished (success or failure).'
        }
    }
}
