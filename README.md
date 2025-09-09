# tech-test-2

Frontend done using NextJS
Backend done using Node 22.18 + express + prisma + docker


# Backend Instructions:

these instruction should be when you are in the folder `/backend`

* run `./scripts/up-dev`
* in a second terminal
  * `yarn prisma generate`
  * `yarn prisma migrate deploy` to deploy changes
  * `yarn prisma db seed` to initialize the db with data
  * `yarn prisma migrate reset` in case that something go wrong
* Optional Commands
  * `yarn prisma dev --name {{name}}` if u want to make new migrations

# Frontend Instructions:

these instruction should be when you are in the folder `/frontend`

keep on mind that we are using yarn4, so probably you will need `corepack enable`

* run `yarn install`
* run `yarn dev`


Note:

some validations can be missing, at backend level we should validate the user authenticated to confirm if can or not perform any action, etc
