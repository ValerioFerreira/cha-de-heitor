import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

/**
 * A prévia que aparece quando o link é colado no WhatsApp.
 *
 * Só a Autography é embarcada, então tudo aqui sai na mesma letra — o que,
 * para um convite, é exatamente o certo. Nada de fonte de sistema: o gerador
 * de imagem não tem nenhuma, e o texto sairia em branco.
 */
export const alt = "Esperando Heitor — 20 de agosto de 2026, 19h30, Olinda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Imagem() {
  const autography = await readFile(
    path.join(process.cwd(), "public/fonts/Autography.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #e8f0f8 0%, #fbf7f0 42%, #f2e0c4 78%, #e3c79c 100%)",
          fontFamily: "Autography",
          color: "#032a42",
        }}
      >
        <div style={{ display: "flex", fontSize: 210, lineHeight: 1 }}>Heitor</div>

        <div
          style={{
            display: "flex",
            width: 260,
            height: 1,
            background: "#b3926f",
            marginTop: 46,
            marginBottom: 34,
          }}
        />

        <div style={{ display: "flex", fontSize: 54, color: "#7a5c3f", lineHeight: 1.3 }}>
          20 de agosto de 2026
        </div>
        <div style={{ display: "flex", fontSize: 44, color: "#9a7c5c", marginTop: 10 }}>
          19h30 · Pizzaria Atlântico, Olinda
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Autography", data: autography, style: "normal", weight: 400 }],
    }
  );
}
