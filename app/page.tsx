import { runBrandForgePipeline, type PipelineInput } from "../lib/pipeline";

const demoInput: PipelineInput = {
  instagram: "@viva.joaopessoa",
  websiteUrl: "https://vivajoaopessoa.com/eventos",
  audience: "moradores e turistas de João Pessoa interessados em eventos locais",
  contentSource:
    "Festival de verão em João Pessoa reúne gastronomia, música ao vivo, experiências para famílias e atrações gratuitas no centro histórico durante o fim de semana.",
  platform: "instagram",
  goal: "engajar",
  strategy: "viral",
};

const steps = runBrandForgePipeline(demoInput);
const previewGradient = "linear-gradient(135deg, #ff4d8d, #ffd166, #06d6a0)";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="space-y-6">
            <p className="w-fit rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
              MVP transparente de pipeline criativo
            </p>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                BrandForge transforma marca, conteúdo e objetivo em uma campanha pronta para gerar imagem.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                Em vez de um gerador caixa-preta, este MVP mostra cada agente do processo: análise de marca,
                extração de conteúdo, planejamento, direção criativa, prompt, geração e revisão de qualidade.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Agentes" value="7" />
              <Metric label="Formato" value="JSON" />
              <Metric label="Review alvo" value="≥ 9" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-2xl p-5" style={{ background: previewGradient }}>
              <div className="rounded-2xl bg-white/90 p-5 text-slate-950 shadow-xl">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-600">Instagram</p>
                <h2 className="mt-6 text-4xl font-black leading-tight">Você precisa ver: Festival de verão em João Pessoa reúne gastronomia</h2>
                <p className="mt-6 text-lg font-semibold text-slate-700">gastronomia • música ao vivo • atrações gratuitas</p>
                <button className="mt-8 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Compartilhe agora</button>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-7">
          {steps.map((step, index) => (
            <article key={step.name} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-slate-950">
                  {index + 1}
                </span>
                <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">✓ concluído</span>
              </div>
              <h3 className="text-lg font-bold">{step.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-black">Entrada do projeto</h2>
            <dl className="mt-6 space-y-4 text-sm">
              {Object.entries(demoInput).map(([key, value]) => (
                <div key={key}>
                  <dt className="font-bold uppercase tracking-wide text-cyan-200">{key}</dt>
                  <dd className="mt-1 text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Modo transparente</h2>
              <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">objetos JSON por agente</span>
            </div>
            <div className="mt-6 grid gap-4">
              {steps.map((step) => (
                <details key={step.name} className="group rounded-2xl border border-white/10 bg-black/30 p-4" open={step.name === "Creative Director"}>
                  <summary className="cursor-pointer list-none font-bold group-open:text-cyan-200">{step.name}</summary>
                  <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-200">
                    {JSON.stringify(step.output, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <p className="text-3xl font-black text-cyan-100">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}
