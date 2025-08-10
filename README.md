# SermonIndex PoC

This is a proof of concept for a SermonIndex app using Remix. You can read the [OSS Disclosure](/public/markdown-content/oss-disclosure.md) of all open source packages used.

## Development

Install the deps:

- Node.js
- npm

```shell
npm install
```

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

### Generating the OSS disclosure

To generate the OSS disclosure, use license-checker in this and the api repo. Copy the list of
licenses into the public/oss-disclosure.md file (replacing the existing content).

`npx license-checker --production --markdown`
