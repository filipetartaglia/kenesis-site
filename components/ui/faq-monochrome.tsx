"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FAQ } from "@/types";

export type FaqItem = FAQ;

export function FaqMonochrome({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-kenesis-greenDark/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-start gap-6 py-7 text-left"
            >
              {/* Number */}
              <span className="w-8 shrink-0 pt-0.5 font-display text-sm tabular-nums text-kenesis-greenDark/30 transition-colors group-hover:text-kenesis-green">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Question */}
              <span className="flex-1 font-display text-lg leading-snug text-kenesis-greenDark transition-colors group-hover:text-kenesis-green lg:text-xl">
                {item.q}
              </span>

              {/* Icon */}
              <motion.span
                animate={{ rotate: isOpen ? 0 : 0 }}
                className="mt-1 shrink-0 text-kenesis-green transition-colors group-hover:text-kenesis-lime"
              >
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-8 pl-14 pr-8 text-[15px] leading-relaxed text-neutral-500">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
