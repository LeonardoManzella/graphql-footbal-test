# Imagen base
FROM node:14

# Directorio de la app
WORKDIR /app

# Copiado de archivos
ADD . /app

# Dependencias
RUN npm install

# Puerto
EXPOSE 8080

# Comandos
CMD ["npm", "run", "start"]