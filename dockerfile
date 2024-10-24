# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json desde la carpeta back
COPY back/package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación desde la carpeta back
COPY back/ .

# Instala el cliente de Prisma y genera los archivos necesarios
RUN npx prisma generate

# Expone la aplicación en el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:dev"]