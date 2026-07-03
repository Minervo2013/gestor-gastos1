-- CreateTable
CREATE TABLE "tarjetas" (
    "id" TEXT NOT NULL,
    "ultimos4" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "tarjetas_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN "tarjetaId" TEXT;

-- AddForeignKey
ALTER TABLE "tarjetas" ADD CONSTRAINT "tarjetas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_tarjetaId_fkey" FOREIGN KEY ("tarjetaId") REFERENCES "tarjetas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
