Instructions:

* run ./scripts/up-dev
* in a second terminal
  * `yarn prisma generate`
  * `yarn prisma db seed` to initialize the db with data
  * `yarn prisma dev --name {{name}}` if u want to make new migrations
  * `yarn prisma migrate deploy` to deploy changes for example in production
  * `yarn prisma migrate reset` in case that something go wrong