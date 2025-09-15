# Docker Configuration

This folder contains all Docker-related files for Cipheria.

## Files

- **`Dockerfile`** - Production Docker build
- **`Dockerfile.dev`** - Development Docker build  
- **`docker-compose.yml`** - Docker Compose configuration
- **`build.sh`** - Build script for creating Docker images

## Quick Start

### Production
```bash
docker build -f docker/Dockerfile -t cipheria .
docker run -p 3000:3000 cipheria
```

### Development
```bash
cd docker
docker-compose --profile dev up
```

### Using Build Script
```bash
cd docker
chmod +x build.sh
./build.sh
```

## Docker Compose

The `docker-compose.yml` supports two profiles:

- **Default**: Production build
- **Dev**: Development with hot reload

```bash
# Production
cd docker && docker-compose up

# Development  
cd docker && docker-compose --profile dev up
```

## Build Script

The `build.sh` script:
1. Reads version from `package.json`
2. Builds Docker images with version tags
3. Tags for registry publishing
4. Provides usage instructions

## Environment Variables

- `NODE_ENV` - Set to `production` or `development`
- `NEXT_TELEMETRY_DISABLED` - Disabled by default
- `PORT` - Application port (default: 3000)

## Registry

Images are tagged for GitHub Container Registry:
- `ghcr.io/devjstar/cipheria:latest`
- `ghcr.io/devjstar/cipheria:v0.1.0`

Update the `REGISTRY` variable in `build.sh` to use your own registry.