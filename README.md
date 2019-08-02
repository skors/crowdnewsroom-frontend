# Crowdnewsroom frontend (interviewer) [![Build Status](https://travis-ci.org/correctiv/crowdnewsroom-frontend.svg?branch=master)](https://travis-ci.org/correctiv/crowdnewsroom-frontend) [![codecov](https://codecov.io/gh/correctiv/crowdnewsroom-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/correctiv/crowdnewsroom-frontend)

This is the part of the Crowdnewsroom (CNR) that is visible to the participants. It gets data from the CNR API
and displays a step-by-step interviewer to the users.

The main components of the system are React for the system as a whole, [react-jsonschema-form] for the individual
steps and [json-rules-engine-simplified] for the transitions between the steps.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find information about common generic tasks in this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Installation

First, ensure you have `yarn` installed, and run:

```bash
make install
```

If you don't have, or can't use `yarn`, you can also run `npm install`.

## Running locally for development

```bash
make serve
```

## Building for deployment

The app has a few run commands according to whether you're running locally, on the staging server or on production.

```bash
make build-local
make build-staging
make build-production
```

The output files will be in the `build/` directory.

Currently, the backend URLs used for each command are:

* **build-local**: https://localhost:8000
* **build-staging**: https://crowdnewsroom-staging.correctiv.org
* **build-production**: https://admin.crowdnewsroom.org

If you need to change these, edit the `Makefile` and update them accordingly.

## Testing

```bash
yarn test
```

[react-jsonschema-form]: https://github.com/mozilla-services/react-jsonschema-form
[json-rules-engine-simplified]: https://github.com/RxNT/json-rules-engine-simplified
