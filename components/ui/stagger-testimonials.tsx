"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const kinesisTestimonials = [
  {
    tempId: 0,
    testimonial: "Entenderam exatamente o que buscávamos. Vimos imóveis que faziam sentido para a nossa família, e a agilidade fez toda a diferença na negociação.",
    by: "Mariana Drummond, Compradora",
    imgSrc: "https://framerusercontent.com/images/gA1SCU5nhjQJUNwN4dAS9raqw.webp?width=200&height=200"
  },
  {
    tempId: 1,
    testimonial: "Cada etapa foi conduzida com transparência e segurança jurídica de ponta a ponta. Uma negociação sem sobressaltos, do início ao fim.",
    by: "Ricardo Fonseca, Investidor",
    imgSrc: "https://framerusercontent.com/images/2dvCOPoaEniJFuC835ZxLdqZ0.webp?width=200&height=200"
  },
  {
    tempId: 2,
    testimonial: "A equipe Kenesis foi incrivelmente atenciosa e profissional. Encontraram o imóvel perfeito para o meu perfil em tempo recorde.",
    by: "Camila Souza, Compradora",
    imgSrc: "https://i.pravatar.cc/150?img=47"
  },
  {
    tempId: 3,
    testimonial: "Nunca imaginei que comprar um apartamento poderia ser tão tranquilo. A Kenesis cuida de tudo com muita competência.",
    by: "Rafael Mendes, Comprador",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    tempId: 4,
    testimonial: "Atendimento impecável e conhecimento profundo do mercado de Niterói. Recomendo sem hesitar a qualquer pessoa.",
    by: "Fernanda Lima, Investidora",
    imgSrc: "https://i.pravatar.cc/150?img=44"
  },
  {
    tempId: 5,
    testimonial: "O suporte jurídico e financeiro que a Kenesis oferece faz toda a diferença. Me senti segura do começo ao fim.",
    by: "Ana Beatriz Costa, Compradora",
    imgSrc: "https://i.pravatar.cc/150?img=49"
  },
  {
    tempId: 6,
    testimonial: "Excelência no atendimento. A equipe entende o que o cliente precisa e apresenta as opções certas, sem enrolação.",
    by: "Bruno Cavalcanti, Investidor",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    tempId: 7,
    testimonial: "Precisava de um imóvel em São Francisco e a Kenesis encontrou exatamente o que eu queria, no prazo que eu precisava.",
    by: "Juliana Rios, Compradora",
    imgSrc: "https://i.pravatar.cc/150?img=45"
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof kinesisTestimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 border-kenesis-lime bg-kenesis-greenDark text-white"
          : "z-0 border-kenesis-green/30 bg-kenesis-cream text-kenesis-greenDark hover:border-kenesis-lime/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px rgba(161,186,31,0.3)"
          : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isCenter ? "bg-kenesis-lime/40" : "bg-kenesis-green/20"
        )}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(',')[0]}
        className="mb-4 h-14 w-12 bg-kenesis-green/20 object-cover object-top"
        style={{
          boxShadow: isCenter
            ? "3px 3px 0px rgba(161,186,31,0.4)"
            : "3px 3px 0px rgba(3,66,59,0.15)"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-lg font-medium leading-snug",
        isCenter ? "text-white" : "text-kenesis-greenDark"
      )}>
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-kenesis-lime" : "text-kenesis-green/70"
      )}>
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(kinesisTestimonials);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(() => handleMove(1), 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonialsList]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-colors",
            "border-2 border-kenesis-green/30 bg-white text-kenesis-greenDark",
            "hover:border-kenesis-lime hover:bg-kenesis-greenDark hover:text-kenesis-lime",
            "focus-visible:outline-none"
          )}
          aria-label="Depoimento anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-colors",
            "border-2 border-kenesis-green/30 bg-white text-kenesis-greenDark",
            "hover:border-kenesis-lime hover:bg-kenesis-greenDark hover:text-kenesis-lime",
            "focus-visible:outline-none"
          )}
          aria-label="Próximo depoimento"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
