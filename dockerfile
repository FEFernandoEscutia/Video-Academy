# Etapa 1: Construcción y generación de dependencias
FROM node:18-alpine AS builder
WORKDIR /app

# Copia los archivos package.json y package-lock.json e instala todas las dependencias (incluyendo desarrollo)
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Genera Prisma y compila la aplicación
RUN npx prisma generate
RUN npm run build

# Elimina las dependencias de desarrollo
RUN npm prune --production

# Etapa 2: Imagen final
FROM node:18-alpine
WORKDIR /app

# Copia solo las dependencias de producción y la aplicación compilada desde la etapa de construcción
COPY --from=builder /app /app

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
