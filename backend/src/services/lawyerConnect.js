// ─── lawyerConnect.js ─────────────────────────────────────────────────────────

const { LAWYERS } = require("../data/lawyers.js");

// ─── Match lawyers to detected domains ───────────────────────────────────────

/**
 * Returns up to `limit` available lawyers ranked by how many
 * of the detected domains they cover.
 *
 * @param {Array}  detectedDomains  - output of detectLegalDomains()
 * @param {number} limit            - max results (default 3)
 * @returns {Array} ranked lawyer objects with a `match_score`
 */
const findMatchingLawyers = (detectedDomains, limit = 3) => {
  const domainKeys = detectedDomains.map((d) => d.key);

  const scored = LAWYERS
    .filter((lawyer) => lawyer.available)
    .map((lawyer) => {
      const overlap = lawyer.domains.filter((d) => domainKeys.includes(d));
      return {
        ...lawyer,
        match_score:    overlap.length,
        matched_domains: overlap,
      };
    })
    .filter((l) => l.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score || b.experience_years - a.experience_years);

  // Fallback: if no domain match, return general practitioners
  if (scored.length === 0) {
    return LAWYERS
      .filter((l) => l.available && l.domains.includes("general_law"))
      .slice(0, limit)
      .map((l) => ({ ...l, match_score: 0, matched_domains: ["general_law"] }));
  }

  return scored.slice(0, limit);
};

// ─── Format a single lawyer card ─────────────────────────────────────────────

const formatLawyerCard = (lawyer, index) => {
  const domains = lawyer.matched_domains
    .map((d) => domainLabel(d))
    .join(", ");

  return [
    `**${index + 1}. ${lawyer.name}**`,
    `🏛 ${lawyer.title}  `,
    `📍 ${lawyer.location} &nbsp;|&nbsp; 🕐 ${lawyer.experience_years} yrs experience  `,
    `⚖️ Expertise: ${domains}  `,
    `🗣 Languages: ${lawyer.languages.join(", ")}  `,
    lawyer.linkedin ? `🔗 [LinkedIn Profile](${lawyer.linkedin})` : "",
  ].filter(Boolean).join("\n");
};

// ─── Domain key → human label ─────────────────────────────────────────────────

const DOMAIN_LABELS = {
  criminal_law:   "Criminal Law",
  corporate_law:  "Corporate & Commercial Law",
  family_law:     "Family & Personal Law",
  consumer_law:   "Consumer Law",
  employment_law: "Employment & Labour Law",
  property_law:   "Property & Real Estate Law",
  general_law:    "General Legal Practice",
};

const domainLabel = (key) => DOMAIN_LABELS[key] || key;

// ─── Build the full suggestion block ─────────────────────────────────────────

/**
 * Returns a formatted markdown block with lawyer suggestions,
 * ready to append to any bot response.
 *
 * @param {Array}  detectedDomains  - output of detectLegalDomains()
 * @param {number} limit            - max lawyers to show (default 3)
 * @returns {string|null}           - markdown string, or null if none found
 */
const buildLawyerSuggestionBlock = (detectedDomains, limit = 3) => {
  const lawyers = findMatchingLawyers(detectedDomains, limit);

  if (lawyers.length === 0) return null;

  const primaryDomain = domainLabel(detectedDomains[0]?.key || "general_law");

  const cards = lawyers.map((l, i) => formatLawyerCard(l, i)).join("\n\n---\n\n");

  return [
    `## 👨‍⚖️ Lawyer Connect`,
    `Based on your issue (**${primaryDomain}**), here are verified advocates who can help:\n`,
    cards,
    `\n> 💡 *These suggestions are based on your legal issue. Always verify credentials before engaging a lawyer.*`,
  ].join("\n");
};

module.exports = {
  findMatchingLawyers,
  buildLawyerSuggestionBlock,
};