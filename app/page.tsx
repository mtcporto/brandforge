"use client";

import { useMemo, useState } from "react";
import { runBrandForgePipeline, type PipelineInput } from "@/lib/pipeline";

type Format = {
  id: "post-portrait" | "carousel-portrait" | "story" | "story-carousel" | "post-square" | "carousel-square";
  name: string;
  size: string;
  tag?: string;
};

const formats: Format[] = [
  { id: "post-portrait", name: "Post Portrait", size: "1080 x 1350px", tag: "TOP" },
  { id: "carousel-portrait", name: "Carrossel Portrait", size: "1080 x 1350px", tag: "TOP" },
  { id: "story", name: "Stories Único", size: "1080 x 1920px", tag: "TOP" },
  { id: "story-carousel", name: "Stories Carrossel", size: "1080 x 1920px", tag: "TOP" },
  { id: "post-square", name: "Post Quadrado", size: "1080 x 1080px" },
  { id: "carousel-square", name: "Carrossel Quadrado", size: "1080 x 1080px" },
];

const platforms = [
  { id: "instagram", name: "Instagram", available: true },
  { id: "facebook", name: "Facebook", available: true },
  { id: "linkedin", name: "LinkedIn", available: true },
  { id: "whatsapp", name: "WhatsApp", available: true },
  { id: "tiktok", name: "TikTok", available: false },
  { id: "youtube", name: "YouTube", available: false },
  { id: "twitter", name: "Twitter/X", available: false },
];

const approaches = [
  { id: "viral" as const, icon: "🔥", name: "Viral", description: "Hook inesperado, contraste extremo e CTA de compartilhamento." },
  { id: "educativo" as const, icon: "📚", name: "Educativo", description: "Conteúdo acionável, organizado em passos e fácil de salvar." },
  { id: "comunidade" as const, icon: "💬", name: "Comunidade", description: "Pergunta aberta, tom humano e conversa real nos comentários." },
];

const demoInput: PipelineInput = {
  instagram: "@viva.joaopessoa",
  websiteUrl: "https://vivajoaopessoa.com/eventos",
  audience: "moradores e turistas de João Pessoa interessados em eventos locais",
  contentSource: "Festival de verão em João Pessoa reúne gastronomia, música ao vivo, experiências para famílias e atrações gratuitas no centro histórico durante o fim de semana.",
  platform: "instagram",
  goal: "engajar",
  strategy: "viral",
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState<Format>(formats[0]);
  const [platform, setPlatform] = useState("instagram");
  const [goal, setGoal] = useState<PipelineInput["goal"]>("engajar");
  const [strategy, setStrategy] = useState<PipelineInput["strategy"]>("viral");
  const [source, setSource] = useState("link");
  const [url, setUrl] = useState(demoInput.websiteUrl);
  const [connected, setConnected] = useState(false);
  const [generated, setGenerated] = useState(false);

  const input = useMemo<PipelineInput>(() => ({ ...demoInput, platform: platform === "instagram" ? "instagram" : "linkedin", goal, strategy }), [goal, platform, strategy]);
  const pipeline = useMemo(() => runBrandForgePipeline(input), [input]);
  const creativeBrief = pipeline.find((item) => item.name === "Creative Director")?.output as { headline: string; copyBlocks: string[] };
  const image = pipeline.find((item) => item.name === "Image Generator")?.output as unknown as { previewGradient: string };
  const review = pipeline.find((item) => item.name === "Quality Review")?.output as { overall: number };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="BrandForge início"><span className="brand-mark">B</span>BrandForge</a>
        <div className="topbar-actions"><span className="saved-status"><span className="status-dot" /> Rascunho salvo</span><button className="account-button" type="button" onClick={() => setConnected((value) => !value)}><span className="avatar">{connected ? "VJ" : "MT"}</span>{connected ? "@viva.joaopessoa" : "Minha conta"}</button></div>
      </header>

      <div className="workspace" id="top">
        <aside className="sidebar"><div className="sidebar-heading"><span>CRIAR</span><span className="spark">✦</span></div><nav className="side-nav" aria-label="Navegação do projeto"><button className="side-link active" type="button"><span>✦</span> Nova criação</button><button className="side-link" type="button"><span>▣</span> Meus projetos <small>0</small></button><button className="side-link" type="button"><span>◉</span> Minhas marcas</button></nav><div className="sidebar-note"><span className="note-icon">✺</span><strong>Seu estúdio criativo</strong><p>Crie posts que parecem ter vindo de uma equipe inteira.</p></div></aside>

        <section className="main-content"><div className="page-heading"><div><p className="eyebrow">NOVA CRIAÇÃO <span>/{String(step).padStart(2, "0")}</span></p><h1>Vamos criar algo <em>impossível de ignorar.</em></h1></div><span className="draft-label">Rascunho #001</span></div><Progress current={step} />
          {step === 1 && <TypeStep format={format} setFormat={setFormat} onNext={() => setStep(2)} />}
          {step === 2 && <PlatformStep platform={platform} setPlatform={setPlatform} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StrategyStep goal={goal} setGoal={setGoal} strategy={strategy} setStrategy={setStrategy} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <SourceStep source={source} setSource={setSource} url={url} setUrl={setUrl} connected={connected} setConnected={setConnected} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <ResultStep format={format} image={image} brief={creativeBrief} review={review} generated={generated} onGenerate={() => setGenerated(true)} onBack={() => setStep(4)} />}
        </section>
      </div>
    </main>
  );
}

function Progress({ current }: { current: number }) {
  const labels = ["Formato", "Canal", "Direção", "Conteúdo", "Resultado"];
  return <div className="progress">{labels.map((label, index) => <div className={`progress-item ${index + 1 <= current ? "done" : ""}`} key={label}><span>{index + 1 < current ? "✓" : String(index + 1).padStart(2, "0")}</span>{label}</div>)}</div>;
}

function TypeStep({ format, setFormat, onNext }: { format: Format; setFormat: (format: Format) => void; onNext: () => void }) {
  return <StepFrame eyebrow="01 / FORMATO" title="O que vamos criar hoje?" subtitle="Comece escolhendo o tipo de peça. Você poderá ajustar tudo antes de gerar." onNext={onNext} nextLabel="Escolher canal"><div className="choice-row"><ChoiceCard title="Imagem" description="Post ou story estático" icon="▧" selected /><ChoiceCard title="Vídeo" description="Em breve" icon="▶" disabled /></div><div className="section-label">FORMATO DA IMAGEM</div><div className="format-grid">{formats.map((item) => <button className={`format-card ${item.id === format.id ? "selected" : ""}`} type="button" key={item.id} onClick={() => setFormat(item)}><span className="format-top">{item.tag && <b>⚡ {item.tag}</b>}<i>{item.id.includes("story") ? "9:16" : "4:5"}</i></span><strong>{item.name}</strong><small>{item.size}</small></button>)}</div></StepFrame>;
}

function PlatformStep({ platform, setPlatform, onNext, onBack }: { platform: string; setPlatform: (value: string) => void; onNext: () => void; onBack: () => void }) {
  return <StepFrame eyebrow="02 / CANAL" title="Onde essa peça vai viver?" subtitle="Escolha um canal para adaptar linguagem, proporção e chamada para ação." onNext={onNext} onBack={onBack} nextLabel="Definir direção"><div className="platform-grid">{platforms.map((item) => <button className={`platform-card ${item.id === platform ? "selected" : ""} ${!item.available ? "disabled" : ""}`} type="button" key={item.id} disabled={!item.available} onClick={() => setPlatform(item.id)}><span className={`platform-icon ${item.id}`}>{item.id === "instagram" ? "◎" : item.id === "facebook" ? "f" : item.id === "linkedin" ? "in" : item.id === "whatsapp" ? "◔" : "·"}</span><strong>{item.name}</strong>{!item.available && <small>Em breve</small>}</button>)}</div></StepFrame>;
}

function StrategyStep({ goal, setGoal, strategy, setStrategy, onNext, onBack }: { goal: PipelineInput["goal"]; setGoal: (value: PipelineInput["goal"]) => void; strategy: PipelineInput["strategy"]; setStrategy: (value: PipelineInput["strategy"]) => void; onNext: () => void; onBack: () => void }) {
  return <StepFrame eyebrow="03 / DIREÇÃO" title="Qual é a intenção por trás do post?" subtitle="A estratégia guia o texto, o layout e a energia da arte. Sem jargão, só decisões que fazem diferença." onNext={onNext} onBack={onBack} nextLabel="Escolher conteúdo"><div className="section-label">OBJETIVO DO POST</div><div className="goal-grid"><button className={`goal-card ${goal === "engajar" ? "selected" : ""}`} type="button" onClick={() => setGoal("engajar")}><strong>Engajar</strong><span>Aumentar interação e comunidade</span></button><button className={`goal-card ${goal === "vender" ? "selected" : ""}`} type="button" onClick={() => setGoal("vender")}><strong>Vender</strong><span>Converter seguidores em clientes</span></button><button className={`goal-card ${goal === "informar" ? "selected" : ""}`} type="button" onClick={() => setGoal("informar")}><strong>Informar</strong><span>Ensinar e construir autoridade</span></button></div><div className="section-label approach-label">ABORDAGEM <span>(OPCIONAL)</span></div><div className="approach-grid">{approaches.map((item) => <button className={`approach-card ${strategy === item.id ? "selected" : ""}`} type="button" key={item.id} onClick={() => setStrategy(item.id)}><span className="approach-icon">{item.icon}</span><strong>{item.name}</strong><span>{item.description}</span></button>)}</div></StepFrame>;
}
function SourceStep({ source, setSource, url, setUrl, connected, setConnected, onNext, onBack }: { source: string; setSource: (value: string) => void; url: string; setUrl: (value: string) => void; connected: boolean; setConnected: (value: boolean) => void; onNext: () => void; onBack: () => void }) {
  function connectInstagram() {
    if (process.env.NEXT_PUBLIC_INSTAGRAM_OAUTH_ENABLED === "true") {
      window.location.href = "/api/instagram/connect";
      return;
    }
    setConnected(!connected);
  }

  return <StepFrame eyebrow="04 / CONTEÚDO" title="De onde vem a ideia?" subtitle="Cole um link e deixe o BrandForge encontrar o que vale a pena transformar em conteúdo." onNext={onNext} onBack={onBack} nextLabel="Revisar criação"><div className="source-tabs"><button className={source === "link" ? "active" : ""} type="button" onClick={() => setSource("link")}>A partir de link</button><button className={source === "idea" ? "active" : ""} type="button" onClick={() => setSource("idea")}>Criar do zero</button><button className={source === "inspiration" ? "active" : ""} type="button" onClick={() => setSource("inspiration")}>Inspirações</button></div>{source === "link" ? <div className="link-form"><label htmlFor="source-url">Cole o link da sua matéria, evento ou página</label><div className="input-wrap"><span>↗</span><input id="source-url" value={url} onChange={(event) => setUrl(event.target.value)} /></div><div className="link-result"><span className="site-thumb">VJ</span><div><small>CONTEÚDO ENCONTRADO</small><strong>Viva João Pessoa!</strong><p>Eventos, shows, bares, restaurantes e programação completa de João Pessoa em um só lugar.</p></div><span className="check">✓</span></div></div> : <textarea className="idea-input" placeholder="Descreva sua ideia, evento ou mensagem principal..." rows={6} />}<div className={`connect-panel ${connected ? "connected" : ""}`}><span className="instagram-badge">◎</span><div><strong>{connected ? "Instagram conectado" : "Conecte seu Instagram"}</strong><p>{connected ? "@viva.joaopessoa · perfil analisado para esta criação" : "Usaremos seu perfil para entender cores, tom e estilo da marca."}</p></div><button type="button" onClick={connectInstagram}>{connected ? "Conectado ✓" : "Conectar conta"}</button></div></StepFrame>;
}
function ResultStep({ format, image, brief, review, generated, onGenerate, onBack }: { format: Format; image: { previewGradient: string }; brief: { headline: string; copyBlocks: string[] }; review: { overall: number }; generated: boolean; onGenerate: () => void; onBack: () => void }) {
  return <div className="result-layout"><div className="result-copy"><p className="eyebrow">05 / RESULTADO</p><h2>Seu briefing está <em>pronto para ganhar forma.</em></h2><p className="result-intro">A IA combinou sua marca, o conteúdo do link e a direção viral em uma proposta visual. Confira o porquê antes de gerar.</p><div className="brief-card"><div className="brief-header"><span>CREATIVE DIRECTOR</span><b>✓ concluído</b></div><h3>{brief.headline.toUpperCase()}</h3>{brief.copyBlocks.slice(1).map((block) => <p key={block}>• {block}</p>)}</div><div className="review-line"><span><b>{review.overall}</b>/10 qualidade prevista</span><span>Formato: {format.name}</span></div><div className="result-actions"><button className="ghost-button" type="button" onClick={onBack}>← Ajustar</button><button className="primary-button" type="button" onClick={onGenerate}>{generated ? "Imagem gerada ✓" : "Gerar imagem ✦"}</button></div>{generated && <div className="success-message">Imagem pronta. No próximo passo, conecte a publicação à conta do Instagram.</div>}</div><div className="generated-preview"><div className="preview-top"><span>PREVIEW · {format.size}</span><span className="live-dot">● pronto</span></div><div className="art-preview" style={{ background: image.previewGradient }}><div className="art-content"><span className="art-label">@VIVA.JOÃOPESSOA</span><h3>{brief.headline}</h3><p>Shows que você nem sabia que iam rolar.<br />Gastronomia que o Google ainda não te mostrou.</p><strong>MARCA QUEM PRECISA VER ISSO ↗</strong></div></div><div className="preview-foot"><span>Imagem estática</span><span>{format.size}</span></div></div></div>;
}

function StepFrame({ eyebrow, title, subtitle, children, onNext, onBack, nextLabel }: { eyebrow: string; title: string; subtitle: string; children: React.ReactNode; onNext: () => void; onBack?: () => void; nextLabel: string }) {
  return <div className="step-frame"><div className="step-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{subtitle}</p></div>{children}<div className="step-actions">{onBack ? <button className="ghost-button" type="button" onClick={onBack}>← Voltar</button> : <span />}{onNext && <button className="primary-button" type="button" onClick={onNext}>{nextLabel} <span>→</span></button>}</div></div>;
}

function ChoiceCard({ title, description, icon, selected, disabled }: { title: string; description: string; icon: string; selected?: boolean; disabled?: boolean }) {
  return <button className={`choice-card ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`} type="button" disabled={disabled}><span className="choice-icon">{icon}</span><span><strong>{title}</strong><small>{description}</small></span>{selected && <b>✓</b>}</button>;
}
