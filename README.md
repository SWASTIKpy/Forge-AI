# ⚒️ Forge AI

Forge AI is an AI-powered full-stack application builder inspired by Loveable. Simply describe the application you want to build in natural language, and Forge AI generates a complete project with a live preview, editable source code, automatic dependency management, AI-assisted debugging, and version history.

The goal is to make building applications feel like collaborating with an AI software engineer while still giving developers full control over the generated code.

---

## ✨ Features

- 🧠 Generate complete full-stack applications from natural language prompts
- ⚡ Live preview while the application is being generated
- 📁 Built-in file explorer
- 💻 Integrated code editor
- 📦 Automatic framework and dependency installation
- 🔒 Secure sandboxed execution environment
- 🐞 AI-powered runtime error analysis and automatic fixes
- 🕒 Version history for every generation and bug fix
- ♻️ Restore or compare previous generations
- 📥 Export projects as ZIP files for local development

---

## 🛠 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Next.js API Routes
- Supabase (Database)
- Clerk Authentication

### AI & Infrastructure

- Gemini API
- Cline
- Sandboxed execution environment

---

## 🚀 How It Works

1. Describe the application you want to build.
2. Forge AI plans the project structure.
3. Required dependencies are installed automatically.
4. The application is generated and launched inside a secure sandbox.
5. Runtime errors are detected and analyzed.
6. AI attempts to automatically fix errors using project context.
7. Every generation is stored so you can restore previous versions at any time.
8. Export your finished project as a ZIP and continue development locally.

---

## 📸 Preview

> Add screenshots or GIFs here.

- Landing Page
- Workspace
- AI Generation
- Code Editor
- Live Preview

---

## ⚙️ Running Locally

Clone the repository

```bash
git clone https://github.com/yourusername/forge-ai.git
cd forge-ai
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env.local` file.

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Arcjet
ARCJET_KEY=

# PostgreSQL
DATABASE_URL=
DIRECT_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Gemini
GEMINI_API_KEY=
```

---

## 🗺️ Roadmap

### Completed ✅

- Responsive frontend
- Authentication with Clerk
- Backend using Next.js API Routes
- AI generation workflow
- Built-in code editor
- File explorer
- Sandboxed execution
- Live preview
- Version history
- export to zip

### Planned 🚧

- Fuzzy search
- Bring Your Own AI API Key (OpenAI, Anthropic, Gemini, etc.)

---

## 📚 What I Learned

This project was my first experience building a **full-stack application with Next.js** used alot of frameworks as i wanted to check how would abstraction make me overthink lol .

Some of the technologies and concepts I explored include:

- Building backend APIs using Next.js Route Handlers
- Authentication with Clerk
- Database integration with Supabase
- Working with shadcn/ui for reusable component
- Handling runtime error analysis and automated fixing
- Managing project versions and state across AI generations
- streaming ai responses 

This project significantly improved my understanding of how modern AI-powered developer tools are built.

---

## 🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

Feel free to open an issue or submit a pull request.

---

## 📄 License

Licensed under the MIT License.
