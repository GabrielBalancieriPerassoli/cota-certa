# Cota Certa

Dashboard de carteira de investimentos (FIIs e ações) feito com **React 19 + TypeScript + Vite + Tailwind CSS 4**.

Este guia é o passo a passo completo pra rodar o projeto do zero numa máquina nova.

---

## 1. Instalar o Node.js

O projeto roda em cima do Node.js. É a **única coisa obrigatória** que você precisa instalar na máquina.

- Baixe a versão **LTS (22.x)** em https://nodejs.org
- Windows: baixe o instalador `.msi`, avança-avança-concluir (deixe marcado "Add to PATH")
- macOS: instalador `.pkg` do site, ou `brew install node`
- Linux: `sudo apt install nodejs npm` costuma trazer versão velha — prefira o [nvm](https://github.com/nvm-sh/nvm)

> **Versão mínima:** Node **20.19+** (o ESLint 10 do projeto exige isso). Node 22 LTS é a recomendação.

Depois de instalar, **feche e abra o terminal de novo** e confira:

```bash
node -v   # deve mostrar v20.19.x ou v22.x.x ou maior
npm -v    # deve mostrar 10.x ou maior
```

## 2. Instalar o Git

Necessário pra clonar o repositório.

- Windows: https://git-scm.com/download/win (instalador padrão, next-next)
- macOS: `xcode-select --install` ou `brew install git`
- Linux: `sudo apt install git`

Confira com:

```bash
git --version
```

Configure seu nome e e-mail (só precisa fazer uma vez na vida):

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

## 3. Instalar o editor (VS Code)

- Baixe em https://code.visualstudio.com

Extensões recomendadas pra este projeto:

| Extensão | Pra quê |
|---|---|
| **ESLint** (`dbaeumer.vscode-eslint`) | mostra os erros de lint direto no editor |
| **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) | autocomplete das classes do Tailwind |
| **ES7+ React snippets** (`dsznajder.es7-react-js-snippets`) | atalhos tipo `rafce` pra criar componente |

## 4. Clonar o repositório

Abra o terminal na pasta onde você quer guardar o projeto (ex.: `Documentos`) e rode:

```bash
git clone https://github.com/GabrielBalancieriPerassoli/cota-certa.git
cd cota-certa
```

> No Windows dá pra abrir o terminal na pasta certa clicando com o botão direito → "Abrir no Terminal", ou usando o terminal integrado do VS Code (`Ctrl + '`).

## 5. Instalar as dependências

Dentro da pasta do projeto:

```bash
npm install
```

Isso lê o `package.json` / `package-lock.json` e baixa tudo (React, Vite, Tailwind, shadcn, lucide-react etc.) pra pasta `node_modules`. Demora 1–2 minutos na primeira vez.

> `node_modules` **não** vem no clone (está no `.gitignore`) — por isso este passo é obrigatório.

## 6. Rodar o projeto

```bash
npm run dev
```

O Vite sobe o servidor de desenvolvimento e mostra algo assim:

```
  VITE v5.4.21  ready in 420 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abra **http://localhost:5173** no navegador. Pronto. 🎉

Qualquer arquivo que você salvar em `src/` atualiza a tela na hora (hot reload). Pra parar o servidor: `Ctrl + C` no terminal.

---

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | sobe o servidor de desenvolvimento (é o que você usa 99% do tempo) |
| `npm run build` | checa os tipos com TypeScript e gera o build de produção em `dist/` |
| `npm run preview` | serve localmente o que foi gerado pelo `build`, pra testar antes de publicar |
| `npm run lint` | roda o ESLint em todo o projeto |

## Estrutura do projeto

```
mercatus/
├─ index.html                 # ponto de entrada do HTML
├─ vite.config.ts             # config do Vite (plugins React + Tailwind, alias "@")
├─ components.json            # config do shadcn/ui
├─ src/
│  ├─ main.tsx                # onde o React é montado na página
│  ├─ App.tsx                 # componente principal (dashboard, carteira, dólar)
│  ├─ index.css               # Tailwind + variáveis de tema
│  ├─ assets/                 # imagens (hero.png, ícones)
│  ├─ components/
│  │  ├─ ui/                  # componentes de tela (Ativo, CarteiraPorTipo)
│  │  └─ utils/               # lógica: ativos.ts, calculos.ts, tipos.ts
│  ├─ hooks/                  # hooks customizados (use-mobile)
│  └─ lib/utils.ts            # helper cn() (clsx + tailwind-merge)
└─ package.json
```

### Detalhes úteis pra codar

- **Alias `@`**: `@/components/ui/Ativo` aponta pra `src/components/ui/Ativo` — configurado no `vite.config.ts` e no `tsconfig`.
- **Tailwind 4**: não tem `tailwind.config.js`. A configuração de tema fica em CSS, dentro de `src/index.css`, e o plugin `@tailwindcss/vite` cuida do resto.
- **Não precisa de `.env`**: o projeto não usa variáveis de ambiente nem chaves de API.
- **Cotação do dólar**: `App.tsx` consome a API pública https://economia.awesomeapi.com.br/last/USD-BRL — precisa de internet, mas não de cadastro.
- **Carteira**: hoje os ativos são dados fixos (mockados) dentro de `buscarCarteira()` no `App.tsx`.
- **Adicionar componente shadcn**: `npx shadcn@latest add <componente>` (ex.: `button`, `card`).

---

## Fluxo de trabalho com Git

Antes de começar a mexer, crie uma branch pra você:

```bash
git checkout -b nome-da-sua-feature
```

Depois de codar:

```bash
git add .
git commit -m "descrição do que você fez"
git push -u origin nome-da-sua-feature
```

Pra pegar as atualizações do `main`:

```bash
git checkout main
git pull
```

---

## Deu problema?

**`node` ou `npm` não é reconhecido como comando**
O Node não entrou no PATH. Feche e abra o terminal de novo. Se não resolver, reinstale marcando "Add to PATH".

**Erro no `npm install` (rede, proxy, `ETIMEDOUT`)**
Tente `npm install --registry=https://registry.npmjs.org/`. Se travou no meio, apague `node_modules` e rode de novo:
```bash
rm -rf node_modules && npm install     # Windows PowerShell: Remove-Item -Recurse -Force node_modules
```

**`npm run lint` reclama da versão do Node**
O ESLint 10 exige Node 20.19+. Atualize o Node.

**Porta 5173 já em uso**
Outro Vite está rodando. Feche o outro terminal, ou rode `npm run dev -- --port 3000`.

**A tela abre mas o valor do dólar fica vazio**
A API externa (awesomeapi) está fora do ar ou você está sem internet. O resto do dashboard continua funcionando.

**PowerShell: "execução de scripts foi desabilitada neste sistema"**
Rode uma vez, como administrador:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Nada funciona e você quer recomeçar do zero**
```bash
rm -rf node_modules package-lock.json
npm install
```
(mas evite commitar a remoção do `package-lock.json` — ele garante que todo mundo instale as mesmas versões)

---

## Backlog

As tarefas do projeto ficam nas [issues](https://github.com/GabrielBalancieriPerassoli/cota-certa/issues), organizadas por fase nas [milestones](https://github.com/GabrielBalancieriPerassoli/cota-certa/milestones).

Como trabalhar em dupla:

1. Escolha uma issue e **se atribua** a ela (`Assignees`) — uma pessoa por tarefa, pra ninguém mexer no mesmo arquivo ao mesmo tempo.
2. Crie uma branch pra ela: `git checkout -b feat/nome-curto`.
3. Ao terminar, abra um Pull Request citando a issue (`Closes #12`) — o GitHub fecha a issue sozinho quando o PR entrar.

Pra adicionar tarefas novas: edite [.github/backlog.json](.github/backlog.json) e dê push na `main`. O workflow [criar-backlog.yml](.github/workflows/criar-backlog.yml) cria as issues que ainda não existem, sem duplicar as antigas.
