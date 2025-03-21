FROM ubuntu:22.04

ARG HUGO_VERSION

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /home/

RUN apt update \
 && apt upgrade -y \
 && apt install -y wget \
 && rm -rf /var/lib/apt/lists/*

RUN wget -O hugo.deb --progress=dot:mega \
    "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" \
 && dpkg -i hugo.deb

# COPY . .

CMD ["hugo", "server", "--disableFastRender", "--bind", "0.0.0.0", "--port", "1313"]