# ScaleScore

Web app to rate pictures of fish.

## Clean deploy steps

1. `create-sql.py` reads in folders of images to rate, and generates `INSERT` statements for the database to track their ratings. It also moves images into `_site` and shards them based on file name.
2. `recreate-tables.sh` drops and recreates production databases, and runs the `INSERT` statements generated in the previous step.
3. `deploy.sh` reads a Neocities API key from `.api-key` and pushes the `_site` folder to that Neocities site, and also deploys the Cloudflare Worker using `wrangler`. By default it will only upload files in the root of `_site`, excluding the sharded images. Uncomment the appropriate line in the script to do a full push.

## Site updates

Generally you only need to update `index.html` and `index.js` (front end); or `src/index.ts` (back end). When updating these files simply run `deploy.sh`.

## API endpoints

Edit these in `src/index.ts`

* `/api/all` - GET - returns all ratings
* `/api/next` - GET - returns a random unrated image.
* `/api/rate/:basename` - POST - record a rating for `basename` image. Payload must include `rater` (string) and `rating` (0, 1) values.

## Downloading data

Run `download.sh`.
