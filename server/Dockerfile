
FROM node:22-slim

# Diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos essenciais para instalar as dependências
COPY package*.json ./

# Atualiza e instalar dependências do sistema necessárias para o SQLite
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*


RUN npm install

# Copiar o restante do código do projeto
COPY . .

# Gerar o cliente Prisma
RUN npm run prisma:generate

# Expor a porta da aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
