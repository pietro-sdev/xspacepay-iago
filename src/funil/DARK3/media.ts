// src/funil/media.ts
import path from "path";

export const MEDIA = {
  video: path.resolve(__dirname, "@/public/media/DARK3/1.mp4"),
  image: path.resolve(__dirname, "@/public/media/DARK3/2.png"), // Imagem principal (remarketing PIX)
  image3: path.resolve(__dirname, "@/public/media/DARK3/3.jpg"), // Imagem para upsell (ex: plano anual)
  image4: path.resolve(__dirname, "@/public/media/DARK3/4.jpg"), // Imagem para cross-sell (ex: Conteúdo Premium)
};
