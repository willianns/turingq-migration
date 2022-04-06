## Build image

For the local image build execute the command below in the project root

> docker build -t turingq/authorizer-config:latest -f packages/authorizer/Dockerfile.prod .

Next tag the image to enable us to push the image on the local registry

> docker tag turingq/authorizer-config localhost:5000/turingq-authorizer-config

Last step push the image on the local registry running on docker

> docker push localhost:5000/turingq-authorizer-config