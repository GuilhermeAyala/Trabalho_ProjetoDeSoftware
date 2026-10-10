# Imagem da API. As dependências são instaladas exclusivamente a partir do
# package-lock.json para que todos executem as mesmas versões.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src

# O Prisma precisa de uma URL durante o generate. O Compose substitui este
# valor pela URL real do serviço postgres quando o container é iniciado.
ENV DATABASE_URL=postgresql://vitta:vitta_dev@postgres:5432/vitta?schema=public

RUN npx prisma generate && npm run build

EXPOSE 3000

CMD ["npm", "start"]
