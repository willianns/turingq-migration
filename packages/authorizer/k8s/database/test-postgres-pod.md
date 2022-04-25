> kubectl run postgresql-postgresql-client --rm --tty -i --restart='Never' --namespace default --image bitnami/postgresql --env="PGPASSWORD=password" --command -- psql --host authorizer-postgres-service -U keycloak

> kubectl exec -it authorizer-postgres-755f7444f6-hrqd9 -- psql -U postgres