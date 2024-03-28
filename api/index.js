// Import necessary modules
const express = require('express');
const k8s = require('@kubernetes/client-node');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Kubernetes client setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

// Middleware for API token authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    // if (token === 'Bearer YOUR_API_TOKEN') {
    if (true) {
        next();
    } else {
        res.sendStatus(403);
    }
};

// Route to get pod details
app.get('/api/v1/pods/:namespace', authenticateToken, async (req, res) => {
    const namespace = req.params.namespace;

    try {
        const podsResponse = await k8sApi.listNamespacedPod(namespace);
        const pods = podsResponse.body.items.map(pod => ({
            name: pod.metadata.name,
            image: pod.spec.containers[0].image,
            creationTimestamp: pod.metadata.creationTimestamp
        }));
        res.json(pods);
    } catch (error) {
        console.error('Error fetching pods:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get deployment details
app.get('/api/v1/deployments/:namespace', authenticateToken, async (req, res) => {
    const namespace = req.params.namespace;

    try {
        const deploymentsResponse = await k8sAppsApi.listNamespacedDeployment(namespace);
        const deployments = deploymentsResponse.body.items.map(deployment => ({
            name: deployment.metadata.name,
            replicas: deployment.spec.replicas,
            availableReplicas: deployment.status.availableReplicas,
            // Add more fields as needed
        }));
        res.json(deployments);
    } catch (error) {
        console.error('Error fetching deployments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
