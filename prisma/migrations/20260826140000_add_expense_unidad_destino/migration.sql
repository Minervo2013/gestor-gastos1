-- AlterTable
ALTER TABLE "expenses" ADD COLUMN "unidadDestinoId" TEXT;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_unidadDestinoId_fkey" FOREIGN KEY ("unidadDestinoId") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
