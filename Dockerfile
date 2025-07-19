FROM node:20-slim AS builder
USER node
WORKDIR /home/node
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node package*.json ./
COPY --chown=node:node tailwind.config.ts ./
COPY --chown=node:node vite.config.ts ./
COPY --chown=node:node postcss.config.js ./
COPY --chown=node:node ./app ./app
COPY --chown=node:node ./public ./public
RUN npm ci

FROM builder AS prod
RUN npm run build && npm install --omit=dev --omit=optional

FROM node:20-slim
USER node
WORKDIR /home/node

ENV PORT=3001

COPY --from=prod /home/node/package.json package.json
COPY --from=prod /home/node/build build
COPY --from=prod /home/node/public public
COPY --from=prod /home/node/node_modules node_modules
EXPOSE 3001

CMD [ "npm", "start" ]