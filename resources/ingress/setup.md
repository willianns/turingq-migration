# Setup Ingress

After creating the cluster execute the following commands in defined order:

> kubectl apply -f resources/ingress/k8s/setup.yml

> kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

> kubectl apply -f resources/ingress/k8s/ingress.yml