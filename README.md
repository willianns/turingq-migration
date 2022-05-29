# TuringQ - Migration

## Commands

### Root Package

- Setting up dependencies for all packages

```
npm run setup
```

### Lerna

- Creating new packages

```
lerna create <package>
```

- Adding dependencies or packages to a specific package

```
lerna add <dependency/package> --scope <package>
```

- Listing all packages

```
lerna list
```

## Setup for local TuringQ (Kind) dev/test

### Recommend OS / Environment

* Any Linux based OS (Debian, Ubuntu, Arch) 
* Windows 10/11 w/ WSL2 (Ubuntu, Arch)

### Boot up k8s cluster turingq-local

Create a local registry for container images

> docker-compose -f resources/registry/docker-compose.yml up

Create the cluster with the command below (from root folder) and registry support

> sh resources/kubernetes/create-kind-cluster.sh 

Create the ingress setup and the rules for the services

> kubectl apply -f resources/ingress/k8s/setup.yml

> kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

> kubectl apply -f resources/ingress/k8s/ingress.yml

After that you need to deploy keycloak authorizer

> npm run deploy:local:authorizer

1. After that generate the client secret for the micro-services accessing http://localhost:9090/auth/
2. Verify that KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY inside the micro-services config-maps and .env are set correctly according to RS256/SIG public key
3. Generate the client-secret for the clients (backend)

Deploy the other services (see the npm tasks available) in package.json
