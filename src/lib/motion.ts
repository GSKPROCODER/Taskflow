import type { Variants } from "framer-motion";

/**
 * Centralized Framer Motion variants. Every animated component pulls from here
 * so motion is consistent and tunable in one place.
 */

const easeOut = "easeOut" as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.18, ease: easeOut },
  },
  exit: { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.12 } },
};

export const slideOver: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2 } },
};

/** Hover lift used by cards. */
export const hoverLift = {
  whileHover: { y: -3, transition: { duration: 0.15 } },
  whileTap: { scale: 0.99 },
};
