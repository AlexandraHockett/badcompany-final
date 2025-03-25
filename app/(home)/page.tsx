import CarrosselEventos from "@/components/CarrosselEventos";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import SpotifyPlaylist from "@/components/SpotifyPlaylist";
import VisitorCounter from "@/components/VisitorCounter";

export default function Home() {
  const playlistId = "487jKTFqWhs6b0AEUz0WpX";

  return (
    <main className="text-white relative min-h-screen w-screen overflow-x-hidden bg-gradient-to-b from-zinc-400 to-zinc-700">
      <Hero />
      <VisitorCounter title="Nossa Comunidade" />
      <CarrosselEventos />
      <SpotifyPlaylist playlistId={playlistId} />
      <Newsletter
        variant="expanded"
        title="Seja o Primeiro a Saber"
        subtitle="Inscreva-se na nossa newsletter e receba em primeira mão informações exclusivas sobre novos eventos, pré-vendas e conteúdos da BadCompany."
      />
      <Contact />
    </main>
  );
}
