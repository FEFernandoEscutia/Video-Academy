# Usa Node.js como imagen base
# FROM node:18
FROM node:18-alpine
# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Instala el cliente de Prisma y genera los archivos necesarios
RUN npx prisma generate

# Expone la aplicación en el puerto 3000
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:dev"]



