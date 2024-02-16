#!/bin/bash

# Costruisce l'immagine Docker
docker build --platform linux/amd64 -t oauth2orize-example .

# Salva l'immagine Docker in un file .tar
docker save oauth2orize-example > oauth2orize-example.tar

# Copia il file .tar sul server remoto usando il percorso relativo al file .pem
scp -i ../s2c-ec2-test.pem oauth2orize-example.tar ubuntu@3.72.38.82:~/

