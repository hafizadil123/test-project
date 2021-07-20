def scmVars
def NAMESPACE

def REGISTRY = "787128240756.dkr.ecr.us-east-1.amazonaws.com"
def IMAGE = "eo-ms-websockets"
def NAME = "websockets"
def PROD_REGISTRY = "091595587632.dkr.ecr.us-east-1.amazonaws.com"

node {
  stage('clear cache') {
    sh 'rm  ~/.dockercfg || true'
    sh 'rm ~/.docker/config.json || true'
  }

  stage('Clone repository'){
    scmVars = checkout scm
  }

  stage('Set namespace'){
    echo scmVars.GIT_BRANCH
    if (scmVars.GIT_BRANCH == 'origin/usa/development') {
      NAMESPACE="development"
      echo NAMESPACE
    } else if (scmVars.GIT_BRANCH == 'origin/usa/production') {
      NAMESPACE="production"
      REGISTRY=PROD_REGISTRY
      echo NAMESPACE
    } else if (scmVars.GIT_BRANCH == 'origin/usa/staging') {
      NAMESPACE="staging"
      echo NAMESPACE
    }
  }

  stage('Build image'){
    dockerImage = REGISTRY + "/" + IMAGE
    echo dockerImage
    app = docker.build(dockerImage)
  }

  stage("Push image to registry"){
    dockerRegistry = "http://" + REGISTRY
    docker.withRegistry(dockerRegistry, 'ecr:us-east-1:ecr-aws'){
      app.push("${env.BUILD_NUMBER}")
      app.push("latest")
    }
  }
  stage("Deploy application"){
    sh "kubectl set image deployment/${NAME} ${NAME}=${REGISTRY}/${IMAGE}:${env.BUILD_NUMBER} -n  ${NAMESPACE}"
  }

  stage("Clear "){
    sh "docker rmi ${REGISTRY}/${IMAGE}:${env.BUILD_NUMBER} -f"
    sh "docker rmi ${REGISTRY}/${IMAGE}:latest -f"
  }
}