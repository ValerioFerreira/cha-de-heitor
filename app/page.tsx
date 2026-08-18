import { ArtDefs } from "@/components/art/filters";
import { ArcoMask } from "@/components/art/motifs";
import { Atmosfera } from "@/components/shared/atmosfera";
import { Musica } from "@/components/shared/musica";
import { Hero, Historia } from "@/components/sections/abertura";
import { Presentes } from "@/components/sections/presentes";
import { Evento, Rsvp } from "@/components/sections/evento";
import { Galeria, Final, Rodape } from "@/components/sections/fecho";

export default function Home() {
  return (
    <>
      <ArtDefs />
      <ArcoMask id="arco" />
      <Atmosfera />

      <main>
        <Hero />
        <Historia />
        <Presentes />
        <Evento />
        <Rsvp />
        <Galeria />
        <Final />
      </main>

      <Rodape />
      <Musica />
    </>
  );
}
