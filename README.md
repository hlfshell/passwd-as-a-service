# Passwd as a service

I was given a programming challenge from a potential employer in order to generate a coding sample. The goal is to create a `/etc/passwd` (and `/etc/group`) HTTP REST microservice. While you would never run this in real life due to securtiy concerns, it makes sense - pick a commonly available function with repeatable output and wrap it in an API for a code sample. The actual challenge as given is here in the repos under `challenge.pdf`.

# Installing
After cloning down the repos with `git clone git@github.com:hlfshell/passwd-as-a-service.git` - do an `npm install` in the directory. There is already a pre-built version ready to go, but you can run `npm run build` if you wish to re-build.

# Tests
To run the tests, please run `npm run test`. If you need to build and test, `npm run build-and-test` will take care of you.

## Human Testing
If you wish to play with the service manually, I've included an Insomnia REST workspace for quickly firing off requests to a running server.

# Running the Server
To run the server, you can simply:

```
npm run server
```
The server will start up on a random open port.

If you wish to control options, such as port, `passwd` file path, or `groups` file path, you can use:

```
npm run server -- --port 9000 --passwd /path/to/passwd --group /path/to/groups
```

# Code Structure

I decided to use Typescript for this project. The more I use Typescript, the more I appreciate its utility in my coding flow. I find a lot of common typos and errors are caught by utilizing Typescript's features, and it consistently surprises me with its depth.

You'll find all Typescript files in `src` and the resulting compiled JavaScript files in `dist`.

The `cli` component executes a CLI for ease of setting configuration options for the server.

The `Server` object instantiates an express server and loads in routes. These routes, stored in `src/routes`, are objects that are organized by the name/goal of the route. Sometimes I create an additional layer of separation between routes and business logic - usually to handle incoming data validation per route - for modularity of code. I did not do this here, however, as it is a simple service that didn't require it.

The `classes` folder contains the two utility classes that handles all core functional logic of the service - reading, parsing, and querying the `passwd` and `group` files.

All tests are in `src/tests`, with some additional helper files in there to make testing easier. For instance, `finished` to fix `node-mocks-http` response mocks from having difficulty with async/await based code.
