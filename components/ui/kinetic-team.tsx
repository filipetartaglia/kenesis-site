"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type TeamMember = {
  name: string;
  role: string;
  location: string;
  bio?: string;
  photo?: string;
  whatsapp?: string;
  instagram?: string;
  initials?: string;
};

export function KineticTeam({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mt-16 flex flex-col gap-px border border-white/10 lg:flex-row">
      {members.map((member, i) => {
        const isActive = active === i;
        return (
          <motion.div
            key={member.name}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            initial={false}
            animate={{ flex: isActive ? 3 : 1 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "relative min-h-[520px] cursor-pointer overflow-hidden border-white/10",
              "lg:border-r last:border-r-0"
            )}
          >
            {/* Background gradient */}
            <motion.div
              className="absolute inset-0 z-0"
              animate={{
                background: isActive
                  ? "linear-gradient(135deg, #03423B 0%, #021a17 60%, #0a2e12 100%)"
                  : "linear-gradient(135deg, #021a17 0%, #03423B 100%)",
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Lime accent blob */}
            <motion.div
              className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl"
              animate={{
                opacity: isActive ? 0.18 : 0,
                scale: isActive ? 1 : 0.6,
                background: "#A1BA1F",
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Large Photo Overlay */}
            {member.photo && (
              <motion.div
                className="absolute bottom-0 right-0 z-0 h-[75%] w-[85%] lg:h-[85%] lg:w-[85%]"
                animate={{
                  opacity: isActive ? 1 : 0.2,
                  scale: isActive ? 1.05 : 1,
                  x: isActive ? 0 : 20,
                  filter: isActive
                    ? "grayscale(0%) drop-shadow(0 20px 30px rgba(0,0,0,0.5))"
                    : "grayscale(100%) drop-shadow(0 0px 0px rgba(0,0,0,0))",
                }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-full w-full object-contain object-bottom origin-bottom"
                />
              </motion.div>
            )}

            {/* Grid texture */}
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Text protection gradient */}
            <motion.div
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-[65%]"
              animate={{
                background: isActive
                  ? "linear-gradient(to top, rgba(2, 26, 23, 0.95) 0%, rgba(2, 26, 23, 0.7) 45%, transparent 100%)"
                  : "linear-gradient(to top, rgba(2, 26, 23, 0.8) 0%, transparent 100%)",
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Number */}
            <div className="absolute left-6 top-6 z-10 font-display text-7xl font-light leading-none text-white/5 select-none">
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-10 pointer-events-none">
              {/* Top Icons */}
              <div className="flex items-start justify-end pointer-events-auto">
                <AnimatePresence>
                  {isActive && member.whatsapp && (
                    <motion.a
                      href={`https://wa.me/${member.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-kenesis-lime/30 bg-black/20 text-kenesis-lime backdrop-blur-md hover:bg-kenesis-lime hover:text-kenesis-greenDark transition-colors shadow-xl"
                    >
                      <ArrowUpRight size={20} />
                    </motion.a>
                  )}
                </AnimatePresence>
              </div>

              {/* Text */}
              <div>
                {/* Role — always visible */}
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-kenesis-lime/80">
                  {member.role}
                </p>

                {/* Name */}
                <motion.h3
                  animate={{ fontSize: isActive ? "1.75rem" : "1.25rem" }}
                  transition={{ duration: 0.4 }}
                  className="font-display leading-tight text-white"
                >
                  {member.name}
                </motion.h3>

                {/* Bio — appears on hover */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <p className="mt-4 text-sm leading-relaxed text-white/60">
                        {member.bio ??
                          "Especialista em imóveis de médio e alto padrão em Niterói e região. Atendimento próximo, dedicado a encontrar o imóvel certo para cada cliente."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Location */}
                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/35">
                  <MapPin size={11} />
                  <span className="uppercase tracking-[0.15em]">{member.location}</span>
                </div>
              </div>
            </div>

            {/* Bottom border accent */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-kenesis-lime"
              animate={{ width: isActive ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
