install:
	yarn install

serve:
	env REACT_APP_BACKEND_URL=http://localhost:8000 yarn start

build-local:
	env REACT_APP_BACKEND_URL=https://localhost:8000 yarn build
	cp -rf conversation build

build-staging:
	env REACT_APP_BACKEND_URL=https://crowdnewsroom-staging.correctiv.org yarn build
	cp -rf conversation build

build-production:
	env REACT_APP_BACKEND_URL=https://admin.crowdnewsroom.org yarn build
	cp -rf conversation build

clean:
	rm -fr build

.PHONY: build-staging
