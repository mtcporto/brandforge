export type PipelineInput = {
  instagram: string;
  websiteUrl: string;
  audience: string;
  contentSource: string;
  platform: "instagram" | "facebook" | "linkedin" | "whatsapp" | "tiktok";
  goal: "engajar" | "vender" | "informar";
  strategy: "viral" | "educativo" | "comunidade" | "autoridade" | "conversao";
};

export type AgentResult<T> = {
  name: string;
  description: string;
  status: "completed";
  output: T;
};

const paletteByStrategy = {
  viral: ["#ff4d8d", "#ffd166", "#06d6a0"],
  educativo: ["#264653", "#2a9d8f", "#e9c46a"],
  comunidade: ["#8f3f56", "#e5989b", "#ffddd2"],
  autoridade: ["#1d3557", "#457b9d", "#f1faee"],
  conversao: ["#2b2d42", "#ef233c", "#edf2f4"],
};

export function runBrandForgePipeline(input: PipelineInput) {
  const brand = {
    primaryColors: paletteByStrategy[input.strategy],
    secondaryColors: ["#101828", "#ffffff", "#f8fafc"],
    brandStyle: input.strategy === "viral" ? "vibrante e editorial" : input.strategy === "comunidade" ? "humano e acolhedor" : "limpo e estratégico",
    tone: input.strategy === "comunidade" ? "pessoal" : input.goal === "engajar" ? "descontraído" : input.goal === "vender" ? "direto" : "educativo",
    logo: input.instagram ? `${input.instagram} (perfil conectado)` : "logo não conectada",
    contrastRecommendations: [
      "Usar texto escuro sobre fundos claros para preservar legibilidade.",
      "Reservar a cor mais forte para CTA, selo ou palavra-chave.",
    ],
  };

  const extracted = {
    title: inferTitle(input.contentSource),
    summary: `Resumo inicial para ${input.audience}: ${input.contentSource.slice(0, 180)}`,
    topics: extractTopics(input.contentSource),
    entities: extractEntities(input.contentSource),
    keywords: extractKeywords(input.contentSource),
  };

  const plan = {
    platform: input.platform,
    goal: input.goal,
    strategy: input.strategy,
    tone: input.strategy === "viral" ? "provocativo" : input.strategy === "comunidade" ? "conversacional" : brand.tone,
    cta: input.strategy === "comunidade" ? "Conte nos comentários o que você acha" : input.goal === "engajar" ? "Compartilhe com alguém que precisa ver isso" : input.goal === "vender" ? "Conheça a oferta" : "Leia o guia completo",
    structure: input.strategy === "viral" ? "hook-list-cta" : input.strategy === "comunidade" ? "pergunta-contexto-conversa" : input.strategy === "educativo" || input.strategy === "autoridade" ? "dor-passos-cta" : "dor-beneficio-cta",
  };

  const creativeBrief = {
    headline: buildHeadline(extracted.title, input.strategy),
    visualDirection: `Arte ${brand.brandStyle}, com hierarquia forte e CTA claro para ${input.platform}.`,
    copyBlocks: [
      buildHeadline(extracted.title, input.strategy),
      extracted.topics.slice(0, 3).join(" • ") || "benefício principal • contexto • ação",
      plan.cta,
    ],
    constraints: ["Evitar poluição visual", "Manter contraste AA", "Não inventar dados sensíveis"],
  };

  const prompt = `Crie uma peça para ${input.platform} com estilo ${brand.brandStyle}. Use paleta ${brand.primaryColors.join(", ")}. Headline: "${creativeBrief.headline}". Estrutura ${plan.structure}. CTA: "${plan.cta}". Público: ${input.audience}. Direção visual: ${creativeBrief.visualDirection}`;

  const image = {
    provider: "mock-gpt-image",
    status: "ready-for-generation",
    previewGradient: `linear-gradient(135deg, ${brand.primaryColors.join(", ")})`,
    prompt,
  };

  const review = {
    brandConsistency: 9.2,
    readability: 9.1,
    contrast: 9.3,
    cta: 8.9,
    overall: 9.1,
    suggestions: ["Aumentar CTA se a peça for usada em stories.", "Testar variação com rosto humano para campanhas virais."],
  };

  return [
    agent("Brand Analyzer", "Extrai identidade visual e tom de marca.", brand),
    agent("Content Extractor", "Transforma URL, texto ou briefing em tópicos acionáveis.", extracted),
    agent("Campaign Planner", "Define objetivo, estratégia, tom, CTA e estrutura.", plan),
    agent("Creative Director", "Combina marca, conteúdo e estratégia em briefing criativo.", creativeBrief),
    agent("Prompt Builder", "Converte o briefing em prompt de geração visual.", { prompt }),
    agent("Image Generator", "Prepara payload para GPT Image, Flux ou provedor equivalente.", image),
    agent("Quality Review", "Avalia consistência, contraste, leitura e força do CTA.", review),
  ];
}

function agent<T>(name: string, description: string, output: T): AgentResult<T> {
  return { name, description, status: "completed", output };
}

function inferTitle(source: string) {
  return source.split(/[.!?\n]/).find(Boolean)?.trim() || "Campanha sem título";
}

function extractTopics(source: string) {
  return source.split(/[,.\n]/).map((item) => item.trim()).filter((item) => item.length > 18).slice(0, 5);
}

function extractEntities(source: string) {
  return Array.from(new Set(source.match(/\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+)?/g) ?? [])).slice(0, 6);
}

function extractKeywords(source: string) {
  const stopwords = new Set(["para", "com", "uma", "que", "dos", "das", "por", "sobre", "este", "esta"]);
  return Array.from(new Set(source.toLowerCase().match(/[a-zà-ÿ]{4,}/g) ?? []))
    .filter((word) => !stopwords.has(word))
    .slice(0, 8);
}

function buildHeadline(title: string, strategy: PipelineInput["strategy"]) {
  if (strategy === "viral") return `Você precisa ver: ${title}`;
  if (strategy === "comunidade") return `Quem mais precisa descobrir: ${title}?`;
  if (strategy === "educativo") return `${title}: 3 coisas para saber antes de sair`;
  if (strategy === "autoridade") return `O que ${title} revela sobre sua marca`;
  return `${title}: transforme interesse em ação`;
}
