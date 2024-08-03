# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
RUN cd /temp/prod && bun install --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=prerelease /usr/src/app/srvr.js .

# run the app
USER bun
EXPOSE 8128/tcp
ENTRYPOINT [ "bun", "run", "srvr.js" ]
