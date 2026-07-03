-- AlterTable
ALTER TABLE "card_summaries" ADD COLUMN "tarjetaId" TEXT;

-- AddForeignKey
ALTER TABLE "card_summaries" ADD CONSTRAINT "card_summaries_tarjetaId_fkey" FOREIGN KEY ("tarjetaId") REFERENCES "tarjetas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
