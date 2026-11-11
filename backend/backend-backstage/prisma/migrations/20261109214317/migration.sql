/*
  Warnings:

  - You are about to drop the `bandas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `oportunidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `perfis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bandas" DROP CONSTRAINT "bandas_id_criador_fkey";

-- DropForeignKey
ALTER TABLE "oportunidades" DROP CONSTRAINT "oportunidades_id_anunciante_fkey";

-- DropForeignKey
ALTER TABLE "perfis" DROP CONSTRAINT "perfis_id_usuario_fkey";

-- DropTable
DROP TABLE "bandas";

-- DropTable
DROP TABLE "oportunidades";

-- DropTable
DROP TABLE "perfis";

-- DropTable
DROP TABLE "usuarios";

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfil" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nome_artistico" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "instrumentos" TEXT NOT NULL,
    "generos" TEXT NOT NULL,
    "biografia" TEXT NOT NULL,

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "banda" (
    "id_banda" SERIAL NOT NULL,
    "id_criador" INTEGER NOT NULL,
    "nome_banda" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,

    CONSTRAINT "banda_pkey" PRIMARY KEY ("id_banda")
);

-- CreateTable
CREATE TABLE "oportunidade" (
    "id_oportunidade" SERIAL NOT NULL,
    "id_anunciante" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "instrumento_procurado" TEXT NOT NULL,

    CONSTRAINT "oportunidade_pkey" PRIMARY KEY ("id_oportunidade")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_id_usuario_key" ON "perfil"("id_usuario");

-- AddForeignKey
ALTER TABLE "perfil" ADD CONSTRAINT "perfil_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banda" ADD CONSTRAINT "banda_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oportunidade" ADD CONSTRAINT "oportunidade_id_anunciante_fkey" FOREIGN KEY ("id_anunciante") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
