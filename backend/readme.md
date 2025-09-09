these instruction should be when you are in the folder `/backend`

- run `./scripts/up-dev`
- in a second terminal
  - `yarn prisma generate`
  - `yarn prisma migrate deploy` to deploy changes
  - `yarn prisma db seed` to initialize the db with data
  - `yarn prisma migrate reset` in case that something go wrong
- Optional Commands
  - `yarn prisma dev --name {{name}}` if u want to make new migrations
