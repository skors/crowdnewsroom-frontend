const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BASE_URL}/forms`;

const makeParams = (verb, data) => {
  return {
    method: verb,
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };
};

function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

function postJSON(url, data) {
  return fetch(`${API_URL}${url}`, makeParams("POST", data)).then(response =>
    response.json()
  );
}

function putJSON(url, data) {
  return fetch(`${API_URL}${url}`, makeParams("PUT", data)).then(response =>
    response.json()
  );
}

export function getForm(investigationId = 1, formId = 1) {
  return fetchJson(
    `${API_URL}/investigations/${investigationId}/forms/${formId}`
  );
}

function createResponse(data, investigationId, formId) {
  return postJSON(
    `/investigations/${investigationId}/forms/${formId}/responses`,
    data
  );
}

function updateResponse(data, investigationId, formId, token) {
  return fetch(
    `${API_URL}/investigations/${investigationId}/forms/${formId}/responses/${
      data.id
    }`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      })
    }
  );
}

export function checkIfEmailExists(email) {
  return fetchJson(`${API_URL}/users/${email}`);
}

export function getToken(email, password) {
  const data = new FormData();
  data.set("username", email);
  data.set("password", password);
  return fetch(`${BASE_URL}/api-token-auth/`, {
    method: "POST",
    body: data
  });
}

export function postResponse(data, investigationId, formId, token) {
  if (data.id) {
    return updateResponse(data, investigationId, formId, token);
  }
  return createResponse(data, investigationId, formId);
}

export function getFormResponse(investigation_id, form_id, token) {
  return fetch(
    `${API_URL}/investigations/${investigation_id}/forms/${form_id}/responses`,
    {
      headers: {
        Authorization: `Token ${token}`
      }
    }
  ).then(response => response.json());
}
