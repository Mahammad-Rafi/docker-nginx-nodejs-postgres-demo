# Troubleshooting

## Containers do not become healthy

```bash
docker compose ps
docker compose logs postgres
docker compose logs api
docker compose logs nginx
```

Look for database initialization errors, missing environment variables, port conflicts, or an API connection timeout.

## Port 80 or 443 is already in use

Stop the conflicting host service, or override only the host ports. In PowerShell:

```powershell
$env:HTTP_PORT = '8080'
$env:HTTPS_PORT = '8443'
docker compose up -d --build
```

Then browse to `http://localhost:8080`. The container ports remain 80 and 443.

## `GET /users` returns an error

Confirm PostgreSQL is healthy and that the API resolves the `postgres` service:

```bash
docker compose exec api getent hosts postgres
docker compose exec postgres psql -U admin -d appdb -c "SELECT * FROM users;"
```

Initialization scripts run only when PostgreSQL creates a new, empty data directory. If an old volume predates `init.sql`, back up required data and intentionally recreate the volume.

## Nginx returns 502 Bad Gateway

Confirm that the API is healthy and resolvable:

```bash
docker compose ps api
docker compose logs api
docker compose exec nginx getent hosts api
```

Then validate the active Nginx configuration:

```bash
docker compose exec nginx nginx -t
```

## Browser warns about HTTPS

The repository generates a self-signed local certificate when building the Nginx image. The warning is expected for a demo. Replace the certificate with one issued for your real hostname before production deployment.

## Inspect network and volume state

```bash
docker network inspect app-net
docker volume inspect postgres-data
```
