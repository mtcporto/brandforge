# BrandForge MVP

BrandForge é um MVP inspirado na ideia de um pipeline transparente de agentes para campanhas criativas. A proposta não é clonar uma ferramenta existente, mas separar responsabilidades para que marca, conteúdo, estratégia, prompt, geração e revisão de qualidade sejam auditáveis.

## Pipeline de agentes

1. **Brand Analyzer** — interpreta Instagram, site e estilo desejado para devolver paleta, tom, recomendações de contraste e diretrizes iniciais.
2. **Content Extractor** — normaliza URL, RSS, PDF ou texto em título, resumo, tópicos, entidades e palavras-chave.
3. **Campaign Planner** — define plataforma, objetivo, estratégia, tom, CTA e estrutura narrativa.
4. **Creative Director** — combina marca, conteúdo e estratégia em um briefing criativo.
5. **Prompt Builder** — transforma o briefing em prompt detalhado para um gerador de imagem.
6. **Image Generator** — encapsula o payload para GPT Image, Flux ou outro provedor.
7. **Quality Review** — pontua consistência de marca, legibilidade, contraste, CTA e nota geral para decidir se deve regenerar.

## MVP implementado

- Wizard Next.js para escolher tipo, formato, canal, objetivo, abordagem e origem do conteúdo.
- Fluxo de link com prévia do conteúdo encontrado e conexão de Instagram em modo demo.
- Pipeline tipado com estratégias viral, educativo e comunidade.
- Briefing criativo, review e preview visual antes de gerar a imagem.
- Endpoint OAuth em `/api/instagram/connect`, pronto para credenciais da Meta.

### Conexão com Instagram

Copie `.env.example` para `.env.local`, preencha o `INSTAGRAM_APP_ID` e o `INSTAGRAM_REDIRECT_URI` cadastrados no Meta for Developers e altere `NEXT_PUBLIC_INSTAGRAM_OAUTH_ENABLED` para `true`. O callback e a troca do `code` por token ainda são o próximo incremento de integração; a geração permanece mockada neste MVP.

## Como visualizar rapidamente

Se as dependências do Next.js ainda não estiverem instaladas, abra a prévia estática em `preview/index.html` ou rode:

```bash
python3 -m http.server 4173 --directory preview
```

Depois acesse `http://127.0.0.1:4173/index.html`.

## Próximos incrementos

- Conectar APIs reais para Instagram, scraping consentido de site e extração de PDF.
- Adicionar provedores reais de LLM e geração de imagem.
- Persistir projetos, marcas e avaliações de qualidade.
- Implementar loop automático de regeneração quando `overall < 9`.
