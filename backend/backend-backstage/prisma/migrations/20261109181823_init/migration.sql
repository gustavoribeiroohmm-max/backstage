-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfis" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nome_artistico" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "instrumentos" TEXT NOT NULL,
    "generos" TEXT NOT NULL,
    "biografia" TEXT NOT NULL,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "bandas" (
    "id_banda" SERIAL NOT NULL,
    "id_criador" INTEGER NOT NULL,
    "nome_banda" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,

    CONSTRAINT "bandas_pkey" PRIMARY KEY ("id_banda")
);

-- CreateTable
CREATE TABLE "oportunidades" (
    "id_oportunidade" SERIAL NOT NULL,
    "id_anunciante" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "instrumento_procurado" TEXT NOT NULL,

    CONSTRAINT "oportunidades_pkey" PRIMARY KEY ("id_oportunidade")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_id_usuario_key" ON "perfis"("id_usuario");

-- AddForeignKey
ALTER TABLE "perfis" ADD CONSTRAINT "perfis_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bandas" ADD CONSTRAINT "bandas_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oportunidades" ADD CONSTRAINT "oportunidades_id_anunciante_fkey" FOREIGN KEY ("id_anunciante") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
