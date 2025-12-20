# AI Teacher Toolkit

A modern, extensible Next.js application for teachers to generate educational content using state-of-the-art AI models. Features include MCQ generation, lesson plans, YouTube scripts, text summarization, rewriting, and more.

## Features
- **MCQ Generator**: Create multiple choice questions from any topic
- **Worksheet Generator**: Generate practice/review/assessment worksheets
- **Lesson Plan Generator**: Structured lesson plans for any subject
- **Essay Grader**: AI-powered essay feedback and grading
- **Text Summarizer**: Summarize long texts for easier comprehension
- **Text Rewriter**: Rewrite content for different grade levels and styles
- **YouTube Content Generator**: Scripts, ideas, and outlines for educational videos
- **PPT Generator**: Create presentation outlines and content
- **Model Selector**: Choose from free and premium AI models (with "Free" tag)
- **Responsive UI**: Works on desktop and mobile
- **Authentication**: Google login (NextAuth.js)

## Tech Stack
- **Next.js 13+ (App Router, TypeScript)**
- **React 18**
- **Tailwind CSS**
- **Shadcn/ui**
- **NextAuth.js**
- **Lucide Icons**
- **OpenAI, Groq, Anthropic, Google Gemini APIs**

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
```
- You can use only the providers you want (e.g., just OpenAI or Groq for free models).
- Get API keys from [OpenAI](https://platform.openai.com/), [Groq](https://console.groq.com/), [Anthropic](https://console.anthropic.com/), [Google AI Studio](https://aistudio.google.com/).

### 4. Run the App Locally
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deployment
- Deploy to [Vercel](https://vercel.com/) or your preferred platform.
- Set the same environment variables in your deployment dashboard.

## Project Structure
- `app/` — Next.js app directory (pages, API routes)
- `components/` — Reusable UI and logic components
- `lib/` — Constants, utility functions, and API integrations
- `public/` — Static assets (images, favicon, etc.)
- `styles/` — Global and component CSS

## Customization & Extensibility
- Add new AI models by editing `lib/constants.ts`
- Add new generators by creating a new page in `app/` and reusing UI components
- All dropdowns and selectors are modular and DRY

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

## License
MIT

## Contact
For questions, feedback, or support, contact [Your Name] at [your-email@example.com]. 