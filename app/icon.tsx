import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icone() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "#032a42",
          color: "#f0d8b6",
          fontFamily: "Autography",
          fontSize: 68,
          paddingTop: 10,
        }}
      >
        H
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Autography", data: autography, style: "normal", weight: 400 }],
    }
  );
}
