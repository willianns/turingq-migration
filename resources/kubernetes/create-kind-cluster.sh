#!/bin/sh
set -o errexit

# Este arquivo é uma adaptação de um arquivo fornecido pela
# documentação do Kind em
# https://kind.sigs.k8s.io/docs/user/local-registry/

# O nome do cluster em uma variável para que possamos
# reutilizar durante o script:
CLUSTER_NAME="turingq-local"

# Aqui temos o caminho do arquivo ".env" que criamos com as
# variáveis do registry:
REGISTRY_ENV_CONFIG="$(dirname $0)/../registry/.env"

# Se o ".env" não existe, imprime uma mensagem de erro e
# interrompe a execução do script:
if [ ! -e "$REGISTRY_ENV_CONFIG" ]
then
  echo "Please create a .env file at /resources/registry/"
  exit
fi

# Esta linha "executa" o arquivo ".env". Depois desta linha,
# as variáveis dentro do ".env" estarão disponíveis
# para o restante do script.
. $REGISTRY_ENV_CONFIG

# Usamos o "cat" para carregar o conteúdo do arquivo dentro
# da variável abaixo:
KIND_CLUSTER_CONFIG=`cat $(dirname $0)/kind-cluster.yml`

# Identificamos o IP dentro da rede interna do Docker do
# container do nosso registry. Em alguns ambientes e versões
# dos componentes que você tiver instalados, utilizar o nome
# do container para identificar o registry não funciona
# adequadamente. Portanto, utilizaremos o IP interno:
REGISTRY_IP=`docker inspect -f '{{.NetworkSettings.Networks.kind.IPAddress}}' "${REGISTRY_NAME}"`

# Se o IP é vazio, o registry não está rodando. Neste caso,
# retornamos uma mensagem de erro e abortamos o script. Se
# isso ocorrer em sua máquina, verifique se o registry está
# executando corretamente.
if [ -z "$REGISTRY_IP" ]
then
  echo "Registry '${REGISTRY_NAME}' not found. Please set up your registry before running this command."
  exit
fi

# A próxima linha executa o comando "kind create cluster", que
# normalmente faríamos no terminal. Entretanto, adicionamos
# algumas configurações apresentadas na documentação do Kind
# para que o registry funcione.
# Adicionamos a parte iniciando em
# "containerdConfigPatches" ao final do arquivo yml.
cat <<EOF | kind create cluster --name=${CLUSTER_NAME} --config=-
${KIND_CLUSTER_CONFIG}
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."localhost:${REGISTRY_PORT}"]
    endpoint = ["http://${REGISTRY_IP}:5000"]
EOF

# A configuração acima é um pouco avançada e possivelmente
# não teremos que fazer isso no futuro. Containerd é o runtime
# de container utilizado por Docker, Kubernetes e outras
# tecnologias. Aqui basicamente configuramos um plugin que
# permitirá que nosso registry seja encontrado de maneira
# similar a como o Docker Hub é encontrado.
# Note, também, que utilizamos o IP do registry no endpoint
# para evitar o problema que citamos anteriormente sobre o
# hostname não funcionar corretamente em alguns ambientes.

# Adicionamos o nosso registry à rede "kind". A rede "kind" é
# a rede utilizada pelo Kind para o cluster Kubernetes local.
# Se o nosso registry não estiver nesta rede, o cluster do
# Kind não será capaz de se comunicar com o registry. O
# comando abaixo resolve este problema.
# Se o registry já estiver na rede "kind", ocorrerá um erro.
# Para evitar que o erro aconteça, adicionamos o "|| true".
docker network connect "kind" "${REGISTRY_NAME}" || true

# Documenta o local registry de acordo com a especificação do
# Kubernetes em:
# https://github.com/kubernetes/enhancements/tree/master/keps/sig-cluster-lifecycle/generic/1755-communicating-a-local-registry
# Novamente, este é um passo que o Kind provavelmente
# resolverá para nós no futuro, e você não precisa se
# preocupar em entender os detalhes agora.
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: local-registry-hosting
  namespace: kube-public
data:
  localRegistryHosting.v1: |
    host: "localhost:${REGISTRY_PORT}"
    hostFromContainerRuntime: "registry:5000"
    hostFromClusterNetwork: "${REGISTRY_IP}:5000"
    help: "https://kind.sigs.k8s.io/docs/user/local-registry/"
EOF
