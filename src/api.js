const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BASE_URL}/forms`;

function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

export function getForm() {
  return fetchJson(`${API_URL}/investigations/1/forms/1`);
}

export function postResponse(data) {
  return fetch(`${API_URL}/investigations/1/forms/1/responses`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  });
}

export function getResponse(token) {
  return fetchJson(`${API_URL}/responses/${token}`);
}
