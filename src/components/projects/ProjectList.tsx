import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { staggerContainer } from "@/lib/motion";
import type { Project } from "@/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  );
}
