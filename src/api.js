const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BASE_URL}/forms`;

const makeParams = (verb, data) => { return {
    method: verb,
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
}};

function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

function postJSON(url, data) {
  return fetch(`${API_URL}${url}`, makeParams("POST", data))
    .then(response => response.json());
}

function putJSON(url, data) {
  return fetch(`${API_URL}${url}`, makeParams("PUT", data))
    .then(response => response.json());
}

export function getForm(investigationId = 1, formId = 1) {
  return fetchJson(
    `${API_URL}/investigations/${investigationId}/forms/${formId}`
  );
}

function createResponse(data){
  return postJSON("/investigations/1/forms/1/responses", data);
}

function updateResponse(data){
  return putJSON(`/responses/${data.token}`, data);
}

export function postResponse(data) {
  if (data.token){
    return updateResponse(data)
  }
  return createResponse(data)
}

export function getResponse(token) {
  return fetchJson(`${API_URL}/responses/${token}`);
}
