# 🌐 Rede Cuidar 🫶

A **Rede Cuidar** é uma **plataforma web fullstack** desenvolvida como projeto final do curso **Recode Pro AI**, com foco em **impacto social, inclusão digital e cuidado humanizado**.

Ela conecta **pessoas que precisam de assistência** com **profissionais autônomos qualificados**, como cuidadoras, babás, fisioterapeutas, psicólogos, enfermeiros, massagistas, nutricionistas, barbeiros e faxineiros(as).

---

## 🧩 Visão Geral do Projeto

> **Missão**: Promover a valorização do cuidado, a autonomia profissional e o acesso facilitado a serviços essenciais.

A Rede Cuidar promove:

- Cuidado centrado na pessoa 🧓👶♿  
- Inclusão de grupos vulneráveis 🌍  
- Geração de renda com dignidade 💼  
- Conexão direta com prestadores de serviço 🤝  

---

## 🔑 Funcionalidades Principais

✅ Cadastro de usuários com **foto de perfil**  
✅ Indicação se oferece serviços (com **especialidade e descrição**)  
✅ Sistema de **login seguro** com autenticação  
✅ Página inicial com **carrossel**, **profissionais em destaque** e **áreas de atuação**  
✅ Busca e exibição de profissionais por **cidade, estado e especialidade**  
✅ Contato direto via **WhatsApp**  
✅ **Proteção reCAPTCHA**  
✅ Tema **claro/escuro**  
✅ Layout **responsivo** para mobile e desktop  

---

## 💡 Propósito Social

Este projeto está alinhado aos seguintes **Objetivos de Desenvolvimento Sustentável (ODS)** da ONU:

- **ODS 8 – Trabalho Decente e Crescimento Econômico**  
- **ODS 10 – Redução das Desigualdades**

> O sistema valoriza profissionais autônomos, promove acesso digital e incentiva o cuidado humanizado, principalmente para **idosos, crianças, PCDs e grupos vulneráveis**.

---

## 🧪 Tecnologias Utilizadas

### 🔷 Frontend
- [React.js](https://reactjs.org/)
- [Formik + Yup](https://formik.org/)
- [Material UI (MUI)](https://mui.com/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- [ReCAPTCHA v2](https://www.google.com/recaptcha/about/)
- [Typed.js](https://mattboldt.com/demos/typed-js/)
- Slick Carousel

### 🔶 Backend
- [Java 17](https://www.oracle.com/java/)
- [Spring Boot 3](https://spring.io/projects/spring-boot)
- [Spring Web, Data JPA](https://spring.io/guides)
- Autenticação com formulário
- Upload de imagem com `MultipartFile`
- DTOs e validação com Bean Validation
- Integração com ViaCEP

### 🗄️ Banco de Dados
- **MySQL 8.0**  
- Gerenciado localmente com **XAMPP**

---

## 🚀 Instalação e Execução

### 🔧 Requisitos
- Node.js v18+ e npm  
- Java 17 ou superior  
- XAMPP com MySQL ativado  
- IDEs: VSCode (frontend), IntelliJ ou Eclipse (backend)

### 📦 Frontend (React)

```bash
git clone https://github.com/renaneliakim1/redecuidar2.git
cd rede-cuidar-front
npm install
VITE_RECAPTCHA_SITE_KEY=CHAVE_DO_GOOGLE_RECAPTCHA
npm run dev
```

### ☕ Backend (Spring Boot)

```bash
git clone https://github.com/renaneliakim1/redecuidar2.git
cd redecuidar
```

1. Criar o banco de dados:

```sql
create database if not exists redecuidar;
```

2. Configurar `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/redecuidar?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=<AQUI VAI SUA SENHA>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

```

3. Executar o projeto (`RedeCuidarApplication.java`)

---

## 📂 Estrutura de Pastas

### Frontend:
```
📦 src
 ┣ 📂 components
 ┣ 📂 assets
 ┣ 📂 services
 ┣ App.jsx
 ┗ main.jsx
```

### Backend:
```
📦 src/main/java/com/redecuidar
 ┣ 📂 config
 ┣ 📂 controller
 ┣ 📂 dto
 ┣ 📂 model
 ┣ 📂 repository
 ┣ 📂 service
 ┗ RedeCuidarApplication.java
```

---

## 🧠 Conclusão

O **Rede Cuidar** é mais que um sistema. É uma ponte digital para gerar cuidado, dignidade e oportunidades.

📚 **Desenvolvido como projeto final da Recode Pro AI 2025**  
👨‍💻 Por: **Renã Eliakim Oliveira Silva**

---

