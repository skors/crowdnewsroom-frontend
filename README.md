# Crowdnewsroom frontend (interviewer) [![Build Status](https://travis-ci.org/correctiv/crowdnewsroom-frontend.svg?branch=master)](https://travis-ci.org/correctiv/crowdnewsroom-frontend) [![codecov](https://codecov.io/gh/correctiv/crowdnewsroom-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/correctiv/crowdnewsroom-frontend)

This is the part of the Crowdnewsroom (CNR) that is visible to the participants. It gets data from the CNR API
and displays a step-by-step interviewer to the users.

The main components of the system are React for the system as a whole, [react-jsonschema-form] for the individual
steps and [json-rules-engine-simplified] for the transitions between the steps.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find information about common generic tasks in this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Installation

```bash
yarn install
# or npm install
```

## Running

You can start the app with `yarn start` but you will have to set the `REACT_APP_BACKEND_URL` environment
variable to defined which backend to talk to (say your local one vs a publicly deployed instance).

```bash
env REACT_APP_BACKEND_URL=https://mycrowdnewsroom.example.org yarn start
```

## Testing

```bash
yarn test
```

[react-jsonschema-form]: https://github.com/mozilla-services/react-jsonschema-form
[json-rules-engine-simplified]: https://github.com/RxNT/json-rules-engine-simplified
