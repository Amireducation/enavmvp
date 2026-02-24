const fetch = require('node-fetch');

const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:5000/api/status';
const servicesUrl = process.env.SERVICES_URL || 'http://127.0.0.1:5000/api/services';
const requestsUrl = process.env.REQUESTS_URL || 'http://127.0.0.1:5000/api/service-requests';
// Prefer a simple health check for the chatbot to avoid POST/connect issues
const chatbotHealthUrl = process.env.CHATBOT_URL || 'http://127.0.0.1:8000/health';

async function checkBackend() {
  try {
    const res = await fetch(backendUrl);
    const json = await res.json();
    console.log('Backend status:', json);
  } catch (err) {
    console.error('Backend check failed:', err.message);
    process.exitCode = 2;
  }
}

async function checkServices() {
  try {
    const res = await fetch(servicesUrl);
    const json = await res.json();
    console.log('Services:', json.services ? json.services.length + ' items' : JSON.stringify(json));
  } catch (err) {
    console.error('Services check failed:', err.message);
    process.exitCode = 4;
  }
}

async function postServiceRequest() {
  try {
    const payload = { user_id: 'usr_local', service_name: 'Test service request', justification: 'smoke test' };
    const res = await fetch(requestsUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    const json = await res.json();
    console.log('Created request:', json.request ? json.request.request_id : JSON.stringify(json));
  } catch (err) {
    console.error('Create request failed:', err.message);
    process.exitCode = 5;
  }
}

async function checkChatbot() {
  const urlsToTry = [chatbotHealthUrl, chatbotHealthUrl.replace('127.0.0.1', 'localhost')];
  for (const url of urlsToTry) {
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log('Chatbot health:', json);
      return;
    } catch (err) {
      console.warn('Chatbot health check failed for', url, err.message);
    }
  }
  console.error('Chatbot check failed for all tried urls');
  process.exitCode = 3;
}

async function run() {
  console.log('Running smoke tests...');
  await checkBackend();
  await checkServices();
  await checkChatbot();
  await postServiceRequest();
  if (!process.exitCode) console.log('Smoke tests passed');
}

run();
