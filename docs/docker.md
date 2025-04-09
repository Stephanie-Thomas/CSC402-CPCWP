
# Docker Documentation

This documentation explains how to use the Dockerfiles and Docker Compose files for both development and production environments. Each service (frontend, backend-node, leetcode_api, and redis) has dedicated Dockerfile configurations for development (Dockerfile.dev) and production (Dockerfile.prod) scenarios. 


###  Prerequisites:
- Docker: https://www.docker.com/products/docker-desktop/


## 1. Development Environment

The development setup is optimized for an active development cycle. It includes volume mounts, live code reloading, and mounts your local source directories into the container. This allows for immediate reflection of code changes without rebuilding the image every time.

### General Characteristics

- Port Accessibility:
	Each service can be accessed directly by their respective ports, making it easy for testing individual services.
	
-   Volume Mounts:  
    The local project directories are mounted into the containers so that changes on your host are reflected in real time.  
      
    
-   Live Reloading and Polling:  
    Environment variables such as `CHOKIDAR_USEPOLLING` and `WATCHPACK_POLLING `are set to ensure that file changes are detected.
            
----------

### 1.1 Dockerfile.dev Files

#### Leetcode API Service (leetcode-api/Dockerfile.dev)

-   **Base:** Uses `node:20-alpine`.
    
-   **Process:**
    
    -   Sets the working directory to `/usr/src/app`.
        
    -   Copies `package*.json` and installs all dependencies.
        
    -   Copies the complete source code.
        
-   **Run:** Exposes port 3000 and starts the server in development mode with `npm run dev`.
    

 
----------


#### Frontend Service (frontend/Dockerfile.dev)

-   **Base:** Uses `node:18-alpine`.
    
-   **Process:**
    
    -   Sets the working directory to `/app`.
        
    -   Copies `package*.json` and installs all dependencies.
        
    -   Copies the full source code.
        
-   **Run:** Exposes port 3001 and starts the development server with `npm run dev`.
      
----------


#### Backend Service (backend-node/Dockerfile.dev)

-   **Base:** Uses `node:20-alpine`.
    
-   **Process:**
    
    -   Sets the working directory to `/usr/src/app`.
        
    -   Copies `package*.json` and installs all dependencies.
        
    -   Copies the rest of the application source code.
        
-   **Run:** Exposes port 4000 and starts the server using `node server.js`.
   

----------


#### Docker Compose for Development (docker-compose.yml)

-   **Leetcode API:** Builds from `Dockerfile.dev` in `./leetcode-api`, maps port 3000, and mounts local code for live development.
    
-   **Frontend:** Builds from `Dockerfile.dev` in `./frontend`, maps port 3001, mounts code for live updates, and depends on the backend.
    
-   **Backend-node:** Builds from `Dockerfile.dev` in `./backend-node`, maps port 4000, and depends on Redis and the Leetcode API.
    
-   **Redis:** Runs the `redis:alpine` image and maps port 6379 for internal use.

----------

## 2. Production Environment

The production configuration is optimized for security, performance, and isolation. It builds lean images with only the necessary production code and dependencies, and it avoids exposing internal service ports to the public network.

### General Characteristics

-   Multi-Stage Builds:  
    Production Dockerfiles typically use multiple stages. The first stage compiles or bundles the code, and the second stage creates a minimal runtime environment containing only the production-ready files and dependencies.       

-   No Volume Mounts:  
    Source code is baked into the image, preventing unintended changes and ensuring immutability.  
      
-   Environment Variables:  
    Set `NODE_ENV=production` to optimize performance and security (e.g., disable debugging features, use production logging levels).  
      

-   Port Exposure:  
    Only the frontend container (which acts as the public interface) has an exposed port. Backend services and other dependencies remain accessible only over the internal Docker network.  
      
    

----------

### 2.1 Dockerfile.prod Files


#### Leetcode API Service (leetcode-api/Dockerfile.prod)

-   **Stage 1: Build**
    
    -   **Base:** Uses `node:20-alpine`.
        
    -   **Process:** Copies package files, installs all dependencies, then copies the rest of the source.
        
-   **Stage 2: Production**
    
    -   **Base:** Uses `node:20-alpine` for a production-ready runtime.
        
    -   **Process:** Copies `package*.json`, installs only production dependencies with `npm install --production`, and copies everything from the build stage.
        
    -   **Run:** Exposes port 3000 and starts the API with `npm start`.
           

----------

#### Frontend Service (frontend/Dockerfile.prod)

-   **Stage 1: Build**
    
    -   **Base:** Uses `node:18-alpine`.
        
    -   **Process:** Copies package files, installs all dependencies, then copies the rest of the source and runs `npm run build` to generate production assets in `dist`.
        
-   **Stage 2: Production**
    
    -   **Base:** Also uses `node:18-alpine` for a lightweight runtime.
        
    -   **Process:** Copies `package*.json`, the pre-installed `node_modules`, and the `dist` folder from the build stage.
        
    -   **Run:** Exposes port 3001 and starts the application with `npm start`.
    

----------

#### Backend Service (backend/Dockerfile.prod)

-   **Stage 1: Build**
    
    -   **Base:** Uses `node:20-alpine`.
        
    -   **Process:** Copies package files, installs all dependencies, and copies the entire source code.
        
-   **Stage 2: Production**
    
    -   **Base:** Uses `node:20-alpine` to keep the runtime lightweight.
        
    -   **Process:** Copies `package*.json`, installs only production dependencies, then copies all artifacts from the build stage.
        
    -   **Run:** Exposes port 4000 and starts the application with `npm start`.
    

----------

**Docker Compose for Production (docker-compose.prod.yml)**

-   **Leetcode API:** Builds from `Dockerfile.prod` in `./leetcode-api`, sets production environment variables, and is internal (no public port).
    
-   **Frontend:** Builds from `Dockerfile.prod` in `./frontend`, maps port 3001 (only service exposed externally), and runs in production mode.
    
-   **Backend-node:** Builds from `Dockerfile.prod` in `./backend-node`, depends on Redis and Leetcode API, and loads environment variables from `.env`.
    
-   **Redis:** Uses the `redis:alpine` image and runs as an internal service.
      
    

----------

## 3. How to Use This Documentation

### For Developers:

-   Run `docker-compose up --build` to start your full development environment.  
   - You can now access any of the services by their respective ports:
	   - frontend: http://localhost:3001/
	   - backend: http://localhost:4000/
	   - redis: http://localhost:6379/
	   - leetcode-api: http://localhost:3001/

### For Production Operators:

- run `docker-compose -f docker-compose.prod.yml up --build`  to build your production ready application via docker.
- You can now only access the frontend service:
		- frontend:  http://localhost:3001/
		
- All other services are only accessibly within the other docker containers
  
-   Environment Variables & Secrets:  
    Ensure that your .env file and any secret management are configured properly for production (e.g., database connection strings, API keys).  
      
    
------