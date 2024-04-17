#!/bin/bash

npx wrangler d1 execute d1-example --remote --file schemas/schema.sql
parallel -P1 -n1 npx wrangler d1 execute d1-example --remote --file {} ::: schemas/inserts-*.sql
