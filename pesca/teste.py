from PIL import Image

def remover_fundo_branco(caminho_imagem, caminho_saida):
    imagem = Image.open(caminho_imagem).convert("RGBA")
    largura, altura = imagem.size
    nova_imagem = Image.new("RGBA", (largura, altura))

    for y in range(altura):
        for x in range(largura):
            r, g, b, a = imagem.getpixel((x, y))

            # Define como branco pixels próximos do branco (tolerância)
            if r > 240 and g > 240 and b > 240:
                nova_imagem.putpixel((x, y), (255, 255, 255, 0))  # Transparente
            else:
                nova_imagem.putpixel((x, y), (r, g, b, a))

    nova_imagem.save(caminho_saida, "PNG")
    print(f"Imagem salva sem fundo branco em: {caminho_saida}")

# Exemplo de uso
remover_fundo_branco("pdf_cover.png", "pdf_cover_fundo.png")