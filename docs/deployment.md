# Deployment

## Local or single-host deployment

From the repository root, run:

```bash
docker compose up -d --build
```

Check readiness:

```bash
docker compose ps
docker compose logs --tail=100
```

Test the application:

```bash
curl http://localhost/
curl http://localhost/health
curl http://localhost/users
curl http://localhost/dbcheck
curl --insecure https://localhost/health
```

The HTTPS command uses `--insecure` because the bundled certificate is self-signed.

## Updating

After changing application or Nginx files:

```bash
docker compose up -d --build
```

Compose rebuilds changed images and recreates affected containers while retaining the named database volume.

## Stopping

```bash
docker compose down
```

This removes containers and the network but preserves `postgres-data`. To intentionally reset all database data and rerun `init.sql`, use `docker compose down -v` before starting again. That command permanently deletes the project volume.

## Production checklist

- Move credentials to a secrets manager or protected environment file.
- Replace the self-signed certificate with a trusted certificate mounted at runtime.
- Pin image references by digest and establish an update policy.
- Add automated backups and test restoration.
- Run vulnerability scans in CI.
- Add metrics, centralized logs, and alerts.
- Put a firewall in front of the host and expose only required ports.

