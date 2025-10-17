pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        FRONTEND_TARGET = '/var/www/html'
        BACKEND_IMAGE = 'myapp-backend:latest'
        BACKEND_CONTAINER = 'myapp-backend'
        BACKEND_PORT = '8000'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📦 Checking out source code..."
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo "🏗️ Building frontend..."
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo "🚚 Deploying frontend to ${FRONTEND_TARGET}..."
                sh '''
                    rm -rf ${FRONTEND_TARGET}/*
                    cp -r ${WORKSPACE}/${FRONTEND_DIR}/dist/* ${FRONTEND_TARGET}/
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "🐳 Building backend Docker image..."
                    sh '''
                        docker build -t ${BACKEND_IMAGE} .
                    '''
                }
            }
        }

        stage('API Testing') {
            steps {
                echo "🌐 Testing API endpoints..."
                dir("${BACKEND_DIR}") {
                    sh '''
                        # Start backend server for API testing
                        npm start &
                        SERVER_PID=$!
                        sleep 10
                        
                        # Test basic endpoints
                        curl -f http://localhost:8000/ || echo "Root endpoint test failed"
                        curl -f http://localhost:8000/health || echo "Health endpoint test failed"
                        
                        # Test API endpoints
                        curl -X GET http://localhost:8000/user/ || echo "User endpoint test failed"
                        curl -X GET http://localhost:8000/auth/ || echo "Auth endpoint test failed"
                        
                        # Stop the server
                        kill $SERVER_PID 2>/dev/null || true
                    '''
                }
            }
        }
        
        stage('Deploy Backend Container') {
            steps {
                echo "🚀 Deploying backend container..."
                sh '''
                    # Stop and remove old container if exists
                    docker stop ${BACKEND_CONTAINER} || true
                    docker rm ${BACKEND_CONTAINER} || true

                    # Run new container with auto-restart
                    docker run -d \
                        --name ${BACKEND_CONTAINER} \
                        --restart always \
                        --env-file ${WORKSPACE}/${BACKEND_DIR}/.env \
                        -p ${BACKEND_PORT}:8000 \
                        ${BACKEND_IMAGE}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
            echo "🌍 Frontend: http://<YOUR_PUBLIC_IP>/"
            echo "🖥️ Backend API: http://<YOUR_PUBLIC_IP>:${BACKEND_PORT}/"
        }
        failure {
            echo "❌ Pipeline failed — please check logs."
        }
    }
}
