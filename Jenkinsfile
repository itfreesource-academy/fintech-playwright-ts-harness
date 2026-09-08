pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.43.0-jammy'
        }
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    environment {
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = '/ms-playwright'
    }

    stages {
        stage('Checkout Portal Under Test') {
            steps {
                echo "=== Checking out FinTech Portal WebApp ==="
                dir('fintech-payment-portal') {
                    git url: 'https://github.com/vishalprajapati2k25/fintech-payment-portal.git', branch: 'main'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "=== Installing Playwright Node Dependencies ==="
                sh 'npm ci'
            }
        }

        stage('Execute Playwright E2E Test Suites') {
            steps {
                echo "=== Executing Headless E2E Browser Tests ==="
                sh '''
                    export BASE_URL="file://${WORKSPACE}/fintech-payment-portal/index.html"
                    npx playwright test --project=chromium
                '''
            }
        }

        stage('Publish HTML Test Reports') {
            steps {
                echo "=== Publishing Playwright HTML Report ==="
                publishHTML target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright E2E Quality Dashboard'
                ]
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            cleanWs notFailBuild: true
        }
        success {
            echo "SUCCESS: Playwright E2E Quality Gate Passed (OAuth, Idempotency & Kafka Verified)"
        }
        failure {
            echo "FAILURE: Browser E2E Tests Failed - Review HTML Report & Traces"
        }
    }
}
