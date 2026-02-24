# 🧮 Calculadora Angular

Calculadora web simples construída com **Angular 21** como projeto de estudo. Realiza as quatro operações matemáticas básicas com uma interface limpa e responsiva. Visite a aplicação [aqui.](https://gabrzb.github.io/calculadora-angular/)

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)

---

## ✨ Funcionalidades

- **Operações básicas** — adição, subtração, multiplicação e divisão
- **Entrada decimal** — suporte a números com ponto flutuante
- **Operações encadeadas** — o resultado parcial é calculado automaticamente ao adicionar um novo operador
- **Tratamento de erros** — exibe "Erro" ao dividir por zero ou em entradas inválidas, com reset automático
- **Limpar (C)** — reseta o display e o estado interno

---

## 🛠️ Tecnologias

| Tecnologia | Versão |
|---|---|
| Angular | 21 |
| TypeScript | 5.7 |
| Node.js | 18+ |
| Zone.js | 0.15 |

---

## 📁 Estrutura do Projeto

```
src/
├── index.html          # HTML raiz com container da aplicação
├── main.ts             # Bootstrap da aplicação
├── styles.css          # Estilos globais (layout, grid, botões)
└── app/
    ├── app.component.ts  # Componente único com template e lógica inline
    └── app.config.ts     # Configuração do Angular (providers)
```

> O projeto utiliza um **componente standalone** com template inline — toda a UI e lógica ficam em um único arquivo.

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- npm (incluso com o Node.js)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/gabrzb/calculadora-angular.git

# Acesse a pasta do projeto
cd calculadora-angular

# Instale as dependências
npm install
```

### Execução

```bash
# Inicie o servidor de desenvolvimento
npx ng serve --open
```

A aplicação abrirá automaticamente em `http://localhost:4200`.

### Build para Produção

```bash
npx ng build
```

Os arquivos de produção serão gerados na pasta `dist/`.

---

## 💡 Observação (Windows)

Se encontrar erros de política de execução no PowerShell ao rodar os comandos, execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Isso irá redefinir a política que pode interferir no processo descrito anteriormente.

---
