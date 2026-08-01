"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type InteractiveHoverButtonProps = {
  text?: string;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function InteractiveHoverButton({
  text = "Button",
  className,
  href,
  target,
  rel,
  type = "button",
  onClick,
}: InteractiveHoverButtonProps) {
  const classes = cn(
    "group relative inline-flex min-w-[10rem] items-center justify-center overflow-hidden rounded-full border bg-background px-5 py-3 text-center text-sm font-semibold leading-none",
    className
  );

  const content = (
    <>
      <span className="relative z-20 inline-flex items-center gap-2 transition-all duration-300 group-hover:-translate-x-3 group-hover:opacity-0">
        {text}
      </span>
      <div className="pointer-events-none absolute inset-0 z-20 flex translate-x-5 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight size={15} className="shrink-0" />
      </div>
      <div className="pointer-events-none absolute left-3 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full bg-primary transition-all duration-500 ease-out group-hover:left-1/2 group-hover:h-[180%] group-hover:w-[180%] group-hover:-translate-x-1/2" />
    </>
  );

  if (href) {
    const external =
      href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("wa.me");

    if (external) {
      return (
        <a href={href} target={target} rel={rel} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

export { InteractiveHoverButton };
