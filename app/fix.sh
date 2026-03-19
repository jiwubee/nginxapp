#!/bin/bash
set -e

# Kolory dla output'u
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Zmienne - ZMIENIONE
REGISTRY="${REGISTRY:-dockerhub-username}"
APP_NAME="app"
VERSION="v1"
LATEST="latest"

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}App - Build & Test${NC}"
echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Registry: $REGISTRY${NC}"
echo -e "${YELLOW}App Name: $APP_NAME${NC}"
echo ""

# 1. Weryfikacja package-lock.json
echo -e "\n${YELLOW}[1/6] Verifying package-lock.json files...${NC}"
if [ ! -f "backend/package-lock.json" ]; then
  echo -e "${RED}❌ backend/package-lock.json NOT FOUND${NC}"
  echo "Run: cd backend && npm install && cd .."
  exit 1
fi
if [ ! -f "frontend/package-lock.json" ]; then
  echo -e "${RED}❌ frontend/package-lock.json NOT FOUND${NC}"
  echo "Run: cd frontend && npm install && cd .."
  exit 1
fi
echo -e "${GREEN}✅ Both package-lock.json files present${NC}"

# 2. Build backend
echo -e "\n${YELLOW}[2/6] Building backend image...${NC}"
docker build \
  --progress=plain \
  --tag $REGISTRY/$APP_NAME-backend:$VERSION \
  --tag $REGISTRY/$APP_NAME-backend:$LATEST \
  ./backend

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Backend image built${NC}"
else
  echo -e "${RED}❌ Backend build failed${NC}"
  exit 1
fi

# 3. Build frontend
echo -e "\n${YELLOW}[3/6] Building frontend image...${NC}"
docker build \
  --progress=plain \
  --tag $REGISTRY/$APP_NAME-frontend:$VERSION \
  --tag $REGISTRY/$APP_NAME-frontend:$LATEST \
  .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Frontend image built${NC}"
else
  echo -e "${RED}❌ Frontend build failed${NC}"
  exit 1
fi

# 4. List images
echo -e "\n${YELLOW}[4/6] Built images:${NC}"
docker images | grep $REGISTRY/$APP_NAME

# 5. Start containers
echo -e "\n${YELLOW}[5/6] Starting containers...${NC}"
docker-compose down 2>/dev/null || true
sleep 2
docker-compose up -d
sleep 15

# 6. Test health
echo -e "\n${YELLOW}[6/6] Running health checks...${NC}"

# Test backend
echo -n "Backend health: "
if docker-compose exec -T backend wget -q -O- http://localhost:3000/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅${NC}"
else
  echo -e "${RED}❌${NC}"
  docker-compose logs backend
fi

# Test frontend
echo -n "Frontend health: "
if docker-compose exec -T frontend wget -q -O- http://localhost/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅${NC}"
else
  echo -e "${RED}❌${NC}"
  docker-compose logs frontend
fi

# Test API
echo -n "API /items: "
if curl -s http://localhost/api/items | jq -e '.data' > /dev/null 2>&1; then
  echo -e "${GREEN}✅${NC}"
else
  echo -e "${RED}❌${NC}"
fi

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✅ BUILD & TEST COMPLETE${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Application running at: http://localhost"
echo "API available at: http://localhost/api"
echo ""
echo "Image names:"
echo "  - $REGISTRY/$APP_NAME-backend:$VERSION"
echo "  - $REGISTRY/$APP_NAME-backend:$LATEST"
echo "  - $REGISTRY/$APP_NAME-frontend:$VERSION"
echo "  - $REGISTRY/$APP_NAME-frontend:$LATEST"