# Audit Bud - Audit Compliance Agent

A modern React-based dashboard for audit compliance management with AI-powered document analysis.

![Audit Bud Dashboard](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🌟 Features

- **Dark Theme Dashboard**: Modern, clean dark UI design inspired by Notion
- **Interactive Chat Interface**: AI-powered document query system
- **Dynamic Document Analysis**: Real-time metadata parsing and display
- **Screenshot Capture**: Built-in screenshot functionality with html2canvas
- **Responsive Design**: Mobile-friendly layout with smooth animations
- **Webhook Integration**: Seamless API integration with n8n workflows
- **Multi-Document Support**: Handle multiple documents with scrollable interface

## 🚀 Live Demo

**Deployed on GitHub Pages**: [https://araviiiman.github.io/audit-bud](https://araviiiman.github.io/audit-bud)

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Screenshots**: html2canvas
- **Deployment**: GitHub Pages, GitHub Actions
- **Styling**: Custom dark theme with Notion-inspired colors

## 📦 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/araviiiman/audit-bud.git
cd audit-bud
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```

4. **Open** [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## 🚀 Deployment

### Automatic Deployment (GitHub Pages)

This project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch**: The GitHub Action workflow automatically builds and deploys
2. **Manual deployment**: Run `npm run deploy` to deploy manually
3. **Live URL**: [https://araviiiman.github.io/audit-bud](https://araviiiman.github.io/audit-bud)

### Manual Deployment Steps

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to GitHub Pages**:
```bash
npm run deploy
```

3. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Save settings

## 📁 Project Structure

```
audit-bud/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/
│   ├── index.html             # HTML template
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/
│   │   ├── Sidebar.js         # Chat interface with screenshot
│   │   ├── MainPanel.js       # Main content area
│   │   ├── DocumentCard.js    # Dynamic metadata display
│   │   └── ActionsSection.js  # Action buttons (deprecated)
│   ├── App.js                 # Main app with webhook integration
│   ├── index.js              # App entry point
│   └── index.css             # Global styles with Tailwind
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## 🔧 Configuration

### Webhook Integration

The app integrates with your n8n webhook:
- **Endpoint**: `https://n8n.srv1033356.hstgr.cloud/webhook-test/dc46cc6c-b02c-4dff-85c0-41f69e34ad86`
- **Method**: POST
- **Payload**: `{ "query": "user message" }`
- **Response**: `{ "text": "response", "sourceMetadataString": "metadata" }`

### Customization

#### Styling
- **Colors**: Defined in `tailwind.config.js`
- **Theme**: Dark theme with Notion-inspired palette
- **Animations**: Framer Motion for smooth transitions

#### Components
- **Modular Design**: Each component is self-contained
- **Props-based**: Easy to customize and extend
- **Responsive**: Mobile-first design approach

## 🎯 Usage

1. **Ask Questions**: Type queries in the chat input
2. **View Responses**: AI responses appear as chat bubbles
3. **Analyze Documents**: Metadata cards display parsed document information
4. **Take Screenshots**: Use the camera icon to capture the current view
5. **Scroll Documents**: Navigate through multiple documents seamlessly

## 🔄 API Integration

### Request Format
```json
{
  "query": "Show me the risk assessment details"
}
```

### Response Format
```json
{
  "text": "The detailed plan for the implementation...",
  "sourceMetadataString": "RA-LIMS-001 v2 — Risk Assessment...\n---\nIVP-LIMS-001 v1 — IT Implementation..."
}
```

### Metadata Parsing
The app automatically parses metadata strings into structured document cards with:
- Document ID, Version, Status
- Effective Date, Author
- Chunks, Summary, Ranks & Sections, Keywords

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure Node.js 18+ is installed
2. **Deployment Issues**: Check GitHub Pages settings
3. **Webhook Errors**: Verify n8n endpoint is accessible
4. **Screenshot Issues**: Browser permissions may be required

### Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/araviiiman/audit-bud/issues)
- **Repository**: [https://github.com/araviiiman/audit-bud](https://github.com/araviiiman/audit-bud)

## 📄 License

This project is proprietary software for Novo Nordisk.

---

**Built with ❤️ for pharmaceutical audit compliance**
