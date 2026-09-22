pipeline {
    agent any

    environment {
        // Replace with your Docker Hub username
        DOCKER_USER  = 'sruthibabu1'
        IMAGE_NAME   = 'devsecops-sample-app'
        IMAGE_TAG    = "${BUILD_NUMBER}"
        REPO_URL     = 'github.com/sruthi2012-01/argocd-test.git'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Update Helm Image Tag in Git') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
                        sh '''
                            git config user.email "jenkins@ci-pipeline.local"
                            git config user.name "Jenkins CI"
                            
                            # Update image repository, tag, and port in values.yaml
                            sed -i '' "s|repository:.*|repository: ${DOCKER_USER}/${IMAGE_NAME}|g" charts/nginx-chart/values.yaml
                            sed -i '' "s|tag:.*|tag: \"${IMAGE_TAG}\"|g" charts/nginx-chart/values.yaml
                            
                            git add charts/nginx-chart/values.yaml
                            git commit -m "ci: update image tag to ${IMAGE_TAG} [skip ci]" || echo "No changes to commit"
                            git push https://${GH_USER}:${GH_TOKEN}@${REPO_URL} HEAD:main
                        '''
                    }
                }
            }
        }
    }
}
