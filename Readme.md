## LibriBrain Competition Website

### Clone

```bash
git clone git@github.com:neural-processing-lab/2025-libribrain-competition.git
```



### Build and Run

#### With Docker

To build it with `Docker`, run

```bash
cd libribrain-competition-website
docker compose -f docker/docker-compose.yml up --build
```

All done! You should be able to view the website at [http://localhost:1314/](http://localhost:1314/).

#### Local System

To build and preview the site locally, install `hugo` from [https://github.com/gohugoio/hugo/releases/](https://github.com/gohugoio/hugo/releases/). The `Dockerfile` and the `workflow` in this repository use version `0.121.1`.

Once installed, run

```bash
cd libribrain-competition-website
hugo server --disableFastRender --port 1314
```

Now you should be able to view the website at [http://localhost:1314/](http://localhost:1314/).



### Update

To update the content of the website, modify the relevant files in the `content` directory. If the above command is running, you can preview the changes live. Once everything looks good, update the `main` branch (ideally via a PR), to deploy the site.
