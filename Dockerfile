FROM node:lts as dependencies
WORKDIR /www/app/
COPY package.json yarn.lock /www/app/
RUN yarn install --frozen-lockfile

FROM node:lts as builder
COPY . /www/app/
WORKDIR /www/app/
COPY --from=dependencies /www/app/node_modules /www/app/node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /www/app/
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /www/app/next.config.js /www/app
COPY --from=builder /www/app/public /www/app/public
COPY --from=builder /www/app/.next  /www/app/.next
COPY --from=builder /www/app/node_modules /www/app/node_modules
COPY --from=builder /www/app/package.json /www/app/package.json
EXPOSE 3000
CMD ["yarn", "start"]