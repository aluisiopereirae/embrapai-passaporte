# embrapai-passaporte
Link: 
https://aluisiopereirae.github.io/embrapai-passaporte/




####
# EmbrapAI Rural — Guia de publicação como APLICATIVO
### Play Store (Android) e App Store (iPhone)

O projeto já está pronto como **PWA** (Progressive Web App): tem manifest, ícones, service worker e **funciona offline** — requisito que as lojas verificam e uma necessidade real no campo. A partir dele, há 3 rotas, da mais simples à mais completa.

## Custos reais (transparência primeiro)

| Item | Custo |
|---|---|
| Hospedagem do app (GitHub Pages) | **R$ 0** |
| Instalação direta no celular como PWA (rota A) | **R$ 0** |
| Conta de desenvolvedor **Google Play** | **US$ 25, uma única vez** |
| Conta de desenvolvedor **Apple** | **US$ 99 por ano** |

As taxas das lojas são cobradas pelo Google e pela Apple e não têm como ser evitadas. Se o orçamento é zero absoluto, a rota A entrega quase a mesma experiência sem loja. Para instituições, a Apple isenta a taxa de órgãos governamentais e ONGs mediante solicitação — vale verificar para a Embrapa.

---

## Rota A — Instalação direta, sem loja (R$ 0, pronto hoje)

O PWA já é instalável em qualquer Android e iPhone:

1. Publique a pasta `www/` no GitHub Pages (mesmo processo do guia anterior: repositório → upload dos arquivos → Settings → Pages). **Importante:** PWA exige HTTPS, e o GitHub Pages já fornece.
2. No **Android**, ao abrir o link o próprio app mostra o botão "📲 Instalar o aplicativo" (já implementado). O ícone vai para a tela inicial e abre em tela cheia, como app nativo.
3. No **iPhone**, o usuário toca em Compartilhar → "Adicionar à Tela de Início".
4. Depois de instalado, **funciona sem internet** — os dados do produtor ficam no aparelho e sincronizam quando a API estiver ligada.

Essa rota é ideal para o piloto: distribui-se por link/QR Code no WhatsApp, sem esperar revisão de loja.

---

## Rota B — Google Play Store (o caminho recomendado para Android)

O Google aceita PWAs empacotados como **TWA (Trusted Web Activity)**. A ferramenta gratuita **PWABuilder** faz isso sem escrever código Android:

1. **Publique o PWA** (rota A) e anote a URL, ex.: `https://seu_usuario.github.io/embrapai-rural/`.
2. Acesse **https://www.pwabuilder.com**, cole a URL e clique em *Package for Stores → Android*.
   - Package ID: `br.embrapa.embrapai` (o mesmo do `capacitor.config.json`).
   - O PWABuilder gera o **.aab** (pacote da Play Store) e um arquivo `assetlinks.json` com a impressão digital SHA-256 da chave de assinatura.
3. **Vincule o app ao site:** substitua o conteúdo de `www/.well-known/assetlinks.json` pelo gerado (ou só a impressão SHA-256 no modelo já incluído) e republique. É isso que remove a barra de endereço e prova que o app é seu.
4. Crie a conta em **https://play.google.com/console** (US$ 25, uma vez).
5. Crie o aplicativo → envie o `.aab` em *Produção* (ou *Teste interno* primeiro, recomendado) → preencha a ficha:
   - Nome: **EmbrapAI Rural**
   - Descrição curta: "Assistente digital da propriedade: previsões, compradores e tecnologias Embrapa."
   - Ícone 512×512: `www/icones/icone-512.png`
   - Arte de destaque 1024×500: `recursos/feature-graphic-1024x500.png`
   - Capturas de tela: abra o app no celular e capture as telas Início, Passaporte, Mercado e Gêmeo Digital (mínimo 2).
   - Classificação de conteúdo: questionário simples (app utilitário, livre).
   - **Política de privacidade:** obrigatória; um modelo pronto está em `www/privacidade.html` — publique junto e informe o link.
6. Envie para revisão. Primeira publicação costuma levar de 1 a 7 dias.

> Alternativa por linha de comando: `npx @bubblewrap/cli init --manifest URL/manifest.json` e depois `npx @bubblewrap/cli build` gera o mesmo pacote TWA.

---

## Rota C — Apple App Store (e Play Store) com Capacitor

A Apple não aceita TWA; o caminho é embrulhar o app com **Capacitor** (já configurado neste projeto). Serve também para Android, se você preferir um único método para as duas lojas.

### Preparar (uma vez, no seu computador)
```bash
# requisitos: Node.js 18+; Android Studio (Android); Xcode + macOS (iOS)
npm install
npm run android:preparar    # cria a pasta android/
npm run ios:preparar        # cria a pasta ios/  (somente em macOS)
```
O Capacitor copia `www/` para dentro dos projetos nativos. Sempre que alterar o `index.html`, rode `npm run sincronizar`.

### Android (gera .aab para a Play Store)
```bash
npm run android:abrir       # abre o Android Studio
```
No Android Studio: **Build → Generate Signed Bundle** → crie sua keystore (guarde com carinho: perder a chave = não poder atualizar o app) → gere o `.aab` → envie na Play Console como na rota B, passo 4 em diante.

### iOS (App Store)
```bash
npm run ios:abrir           # abre o Xcode (exige um Mac)
```
No Xcode: selecione seu time de desenvolvedor (conta Apple Developer, US$ 99/ano) → **Product → Archive** → *Distribute App → App Store Connect*. Depois, em https://appstoreconnect.apple.com, preencha a ficha (mesmos textos e ícones da Play Store; capturas de tela de iPhone 6,7" são obrigatórias) e envie para revisão (1–3 dias).

> Sem Mac? Serviços de build em nuvem como **Ionic Appflow** e **Codemagic** têm níveis gratuitos que compilam o iOS por você; ainda assim a conta Apple Developer é necessária para publicar.

---

## Checklist de aprovação nas lojas

- [x] Funciona offline (service worker `sw.js` — já incluído e testado)
- [x] Ícones `any` e `maskable` 512px — já incluídos
- [x] Tela cheia, cor de tema, atalhos de ícone — já incluídos
- [ ] `assetlinks.json` com a SHA-256 real da sua chave (rota B, passo 3)
- [ ] Política de privacidade publicada (`www/privacidade.html`, ajuste o e-mail de contato)
- [ ] Capturas de tela reais do aparelho
- [ ] Conta de desenvolvedor criada

## Estrutura do projeto

```
embrapai-app/
├── www/                      ← o aplicativo (publique esta pasta)
│   ├── index.html            ← toda a plataforma (20 estratégias)
│   ├── manifest.json         ← identidade do app para Android/lojas
│   ├── sw.js                 ← funcionamento offline
│   ├── privacidade.html      ← política de privacidade (obrigatória nas lojas)
│   ├── icones/               ← ícones 192/512/maskable/apple
│   └── .well-known/assetlinks.json  ← vínculo app ↔ site (Play Store)
├── capacitor.config.json     ← empacotamento nativo (rota C)
├── package.json              ← scripts npm prontos
├── recursos/                 ← splash e arte de destaque para as lojas
└── api/                      ← API opcional (FastAPI + BigQuery), como antes
```

## Estratégia sugerida de lançamento

1. **Semana 1:** rota A no ar — piloto por QR Code com produtores reais; ajuste textos e preços de referência com o retorno deles.
2. **Semana 2–3:** rota B — Play Store (público rural brasileiro é ~90% Android; comece por ela).
3. **Depois da tração:** rota C para iOS, e ativação da API + BigQuery para a base central da Embrapa.
