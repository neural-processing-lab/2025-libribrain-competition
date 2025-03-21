## LibriBrain Competition Website

### Clone

```bash
git clone git@github.com:neural-processing-lab/libribrain-competition-website.git
```



### Build and Run

Let's build it with docker now `docker` installed

```bash
cd libribrain-competition-website
docker compose -f docker/docker-compose.yml up --build
```

All done! You should be able to view the website at [http://localhost:1314/](http://localhost:1314/).



### Update

You can update the content of the website by updating the relevant files in the `content` directory and get the live preview.

