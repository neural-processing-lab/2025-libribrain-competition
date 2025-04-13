FROM ubuntu:22.04

ARG HUGO_VERSION

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /home/

RUN apt update \
 && apt upgrade -y \
 && apt install -y wget \
 && rm -rf /var/lib/apt/lists/*

RUN ARCH=$(dpkg --print-architecture) \
 && wget -O hugo.tar.gz --progress=dot:mega \
    "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${ARCH}.tar.gz" \
 && tar -xzf hugo.tar.gz \
 && mv hugo /usr/local/bin/hugo \
 && chmod +x /usr/local/bin/hugo \
 && rm -rf hugo.tar.gz

# COPY . .

CMD ["hugo", "server", "--disableFastRender", "--bind", "0.0.0.0", "--port", "1313"]