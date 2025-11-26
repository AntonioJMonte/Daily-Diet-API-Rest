# 📦 API RESTful com Node.js  
Projeto desenvolvido como parte do módulo **“Criando APIs RESTful com Node.js”**, onde o objetivo é construir uma API completa utilizando conceitos fundamentais do Node.js, boas práticas e ferramentas do ecossistema JavaScript.

---

## 🚀 Objetivo do Projeto
O objetivo deste desafio é desenvolver uma **API RESTful** capaz de:

- Criar e autenticar usuários  
- Trabalhar com hashing de senha  
- Gerenciar sessões com cookies  
- Registrar e listar dados persistidos em um banco  
- Utilizar validações e middlewares  
- Estruturar rotas seguindo boas práticas de API

O projeto serve como base para entender como funciona um backend real com **autenticação, persistência e regras de negócio**.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** — ambiente de execução  
- **Fastify** — framework para criação de APIs rápidas e tipadas  
- **Knex.js** — Query Builder utilizado para acessar o banco  
- **SQLite** — banco de dados simples e eficiente para desenvolvimento  
- **Zod** — validação de dados  
- **bcrypt** — hashing e verificação de senhas  
- **TypeScript** — maior segurança e confiabilidade no código  

---

## 🔐 Funcionalidades da API

### **1. Cadastro de Usuário**
- Validação dos campos via **Zod**
- Senha cifrada usando **bcrypt**
- Armazenamento no banco usando **Knex**

### **2. Login**
- Verificação de e-mail e senha  
- Criação de um **cookie de sessão (`sessionId`)**
- Persistência do ID do usuário para futuras requisições autenticadas  

### **3. Rotas Protegidas**
- Acesso permitido apenas se o cookie `sessionId` estiver presente  
- Middleware faz verificação automática  

### **4. Registro de Refeições (Meals)**
- Cada refeição pertence a um usuário autenticado  
- Armazenamento com data, horário e dieta  

### **5. Listagem e Métricas**
- Listar refeições do usuário  
- Cálculo de métricas sobre dieta (ex.: melhor sequência dentro da dieta)  

---

## 📁 Estrutura do Projeto

