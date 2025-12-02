<div align="center">

# 🍁 EventMaple

### The smartest way to organize your event

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

[Live Demo](https://event-maple.edwardiaz.dev/) · [Report Bug](https://github.com/BOTOOM/event-maple/issues) · [Request Feature](https://github.com/BOTOOM/event-maple/issues)

</div>

---

## 📖 About The Project

**EventMaple** is an open-source platform created to help the community manage events of any type efficiently and accessibly. Whether it's tech events, conferences, community workshops, or any other gathering, EventMaple provides the necessary tools for organizers and attendees to manage all information in one place.

### 🎯 Mission

To empower the community to create, organize, and participate in events completely free of charge, simplifying personalized agenda management and improving the experience for both organizers and attendees.

### ✨ What can you do with EventMaple?

#### For Organizers 📅
- Create events of any type (tech or non-tech)
- Add talks, workshops, and activities within each event
- Share all event information with the community
- Facilitate organization and activity planning

#### For Attendees 👥
- Explore events and discover talks of interest
- Manage your personal event agenda as you prefer
- Mark talks and activities you wish to attend
- Keep everything organized in one place, for multiple events

### 🌟 Key Features

- ✅ **Secure authentication** with Supabase (email/password)
- ✅ **Event management** - Create and explore all types of events
- ✅ **Personalized agenda** - Mark and manage your favorite talks
- ✅ **Internationalization (i18n)** - Multi-language support (EN, ES, FR, PT)
- ✅ **SEO Optimized** - Dynamic metadata, sitemap, and robots.txt
- ✅ **PWA Ready** - Installable as an app with offline capabilities
- ✅ **Custom Error Handling** - User-friendly 404 and 500 pages
- ✅ **Responsive design** - Optimized for mobile, tablet, and desktop
- ✅ **Server-Side Rendering (SSR)** - Optimal performance with Next.js 16
- ✅ **Modern interface** - Intuitive and attractive UI/UX
- ✅ **100% Free** - No hidden charges or limitations

---

## 🛠️ Tech Stack

- **Next.js 16** - React Framework with App Router
- **TypeScript** - Static typing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI Components
- **Supabase** - Authentication and database
- **next-intl** - Internationalization routing and translations
- **Lucide React** - Icons
- **date-fns** - Date handling
- **Zustand** - Global state management

---

## 🚀 Installation and Setup

```bash
# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

### Required Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
event-maple/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   │   ├── (auth)/          # Authentication route group
│   │   ├── (dashboard)/     # Protected route group
│   │   ├── page.tsx         # Landing page
│   │   └── layout.tsx       # Root layout
│   └── api/                 # API Routes
├── components/              # React Components
│   ├── ui/                  # shadcn components
│   ├── landing/             # Landing components
│   ├── auth/                # Authentication components
│   └── shared/              # Shared components
├── messages/                # Translation files (en, es, fr, pt)
├── lib/                     # Utilities and configuration
│   ├── i18n/                # Internationalization config
│   ├── supabase/            # Supabase client
│   └── utils.ts             # Helpers
└── public/                  # Static files
```

---

## 📜 Available Scripts

- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - ESLint linter

---

## 🤝 Contributing

Contributions are welcome! This is an open-source project created for the community.

### How to contribute?

1. **Fork** the project
2. Create a **branch** for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add: Amazing Feature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Reporting Issues

If you find a bug or have a suggestion, please [open an issue](https://github.com/BOTOOM/event-maple/issues) with:
- Clear description of the problem or suggestion
- Steps to reproduce (if it's a bug)
- Screenshots if relevant
- Your environment (browser, OS, etc.)

---

## 📄 License

This project is under the **MIT License** - see the [LICENSE](LICENSE) file for more details.

**License summary:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ **Attribution required** - You must include the copyright notice and license

**Important:** This license applies to all content in this repository as of the date of each commit.

---

## 👨‍💻 Author

**Edwar Díaz**

- GitHub: [@BOTOOM](https://github.com/BOTOOM)
- Portfolio: [edwardiaz.dev](https://edwardiaz.dev/)
- Email: [contact@edwardiaz.dev](mailto:contact@edwardiaz.dev)

---

## 🌟 Acknowledgments

Thanks to the entire open-source community and everyone who uses, contributes, and supports EventMaple. This project was created with the purpose of facilitating event management for everyone.

---

## 📞 Support

If you have questions or need help:

- 📧 Email: [contact@edwardiaz.dev](mailto:contact@edwardiaz.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/BOTOOM/event-maple/issues)
- 💬 Contact page: [EventMaple Contact](https://event-maple.edwardiaz.dev/contact)

---

<div align="center">

**⭐ If you find this project useful, consider giving it a star on GitHub ⭐**

Made with ❤️ for the community

</div>
