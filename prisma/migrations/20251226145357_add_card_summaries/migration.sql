-- CreateTable
CREATE TABLE "card_summaries" (
    "id" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "archivo" TEXT NOT NULL,
    "archivoNombre" TEXT NOT NULL,
    "archivoTipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "card_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "card_summaries_userId_periodo_idx" ON "card_summaries"("userId", "periodo");

-- AddForeignKey
ALTER TABLE "card_summaries" ADD CONSTRAINT "card_summaries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
