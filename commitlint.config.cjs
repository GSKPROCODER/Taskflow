// Conventional Commits — enforced via Husky commit-msg hook (PRD §12)
// Format: <type>(scope): <subject>  e.g. feat(tasks): add status update endpoint
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
