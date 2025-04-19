# Usa la imagen base de Node.js 22.14.0
FROM node:22.14.0

# Time zone configuration
ENV TZ=America/Bogota

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código fuente de la aplicación
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Exponer el puerto en el que la app estará corriendo
EXPOSE 3000

# Check if the build was successful
RUN ls -l dist/src

# Comando para ejecutar la aplicación
CMD ["node", "dist/src/main.js"]