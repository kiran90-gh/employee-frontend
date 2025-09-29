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
        AWS_REGION = 'ap-south-1'
        RDS_ENDPOINT = 'database-1.cpugiccsyl82.ap-south-1.rds.amazonaws.com'
        DB_NAME = 'database-1'
    }

    stages {
        stage('Configure AWS') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-rds-credentials') {
                    script {
                        // AWS operations here
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
                    echo 'Building backend with Maven...'
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
                        echo "Testing RDS connection..."
                        // Example: Test database connection
                        sh """
                            # Test PostgreSQL connection (adjust for your database type)
                            PGPASSWORD=${DB_PASSWORD} psql -h ${RDS_ENDPOINT} -U ${DB_USER} -d ${DB_NAME} -c "SELECT version();" || echo "Database connection test completed"
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
                archiveArtifacts artifacts: 'frontend/employee-management-frontend/build/**/*', fingerprint: true
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "Deployment stage would go here"
                    // Add your deployment logic here
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build and tests passed.'
            // Optional: Send success notifications
        }
        failure {
            echo '❌ Build failed. Check the logs above.'
            // Optional: Send failure notifications
        }
        always {
            echo '📊 Build pipeline completed.'
            // Optional: Cleanup operations
        }
    }
}
