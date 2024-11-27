

FROM node:18-alpine AS builder

WORKDIR /app


COPY package.json package-lock.json ./
RUN npm install

# Copiar o restante dos arquivos e rodar o build
COPY . .

# Define a variável de ambiente necessária para o Vite
ARG VITE_GOOGLE_API_KEY
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY


RUN npm run build

# Etapa final: Usar uma imagem leve para servir os arquivos estáticos
FROM nginx:alpine

# Copiar o arquivo de configuração do Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos do build para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
