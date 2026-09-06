# Docker Networking

## The `app-net` bridge

Compose creates a user-defined bridge network with the explicit Docker name `app-net`. All three services join this network. User-defined bridges provide service isolation and automatic DNS-based discovery.

```text
Host ports                         Private app-net ports
80  -> nginx:80                    api:3000
443 -> nginx:443                   postgres:5432
```

`expose` documents the API and database container ports for operators; it does not publish those ports to the host. Only entries under `nginx.ports` create host bindings.

## DNS service discovery

Use service names, never container IP addresses:

- Nginx connects to `api:3000`.
- The API connects to `postgres:5432`.

Docker maintains the name-to-address mapping. You can inspect it with:

```bash
docker compose exec api getent hosts postgres
docker compose exec nginx getent hosts api
```

## Verification

```bash
docker network inspect app-net
docker compose ps
```

In `docker compose ps`, only Nginx should show published host ports. PostgreSQL and the API should show container ports without `0.0.0.0` or `[::]` bindings.

## Hostname caveat

Service names are resolvable only inside Docker networks that contain the service. From the host, use `localhost`; from another `app-net` container, use `api` or `postgres`.

