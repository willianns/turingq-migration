# Setup Ingress

After creating the cluster execute the following commands in defined order:

> kubectl apply -f resources/ingress/k8s/setup.yml

> kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

> kubectl apply -f resources/ingress/k8s/ingress.yml

After that you need to deploy keycloak authorizer and verify that KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY inside the micro-serviecs config-maps are set correctly according to RS256/SIG public key

> npm run deploy:local:authorizer

After that generate the client secret for the micro-services