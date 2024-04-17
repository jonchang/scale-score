#!/bin/bash

echo 'THIS WILL DESTROY PRODUCTION DATABASES'
echo 'CTRL-C to EXIT'
read -rp "Press enter to continue: "
echo ""
echo "Waiting 10 seconds..."
sleep 10

npx wrangler d1 execute d1-example --remote --file schemas/schema.sql
parallel -P1 -n1 npx wrangler d1 execute d1-example --remote --file {} ::: schemas/inserts-*.sql
