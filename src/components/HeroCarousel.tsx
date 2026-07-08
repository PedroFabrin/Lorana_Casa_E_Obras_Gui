import { useEffect, useState } from "react";

const slides = [
  { url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=60", alt: "Obra em andamento" },
  { url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=60", alt: "Furadeira profissional" },
  { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=60", alt: "Equipe trabalhando na obra" },
  { url: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=60", alt: "Ferramentas de construção" },
  { url: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?w=800&q=60", alt: "Trabalhadores em andaime" },
  { url: "https://images.unsplash.com/photo-1541976590-713941681591?w=800&q=60", alt: "Fachada de edifício moderno" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden h-full min-h-[320px] w-full overflow-hidden rounded-lg sm:block">
      {slides.map((slide, i) => (
        <img
          key={slide.url}
          src={slide.url}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((slide, i) => (
          <span
            key={slide.url}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
