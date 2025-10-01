# Account Menu System Documentation

## Overview

The account menu system provides a comprehensive user interface for managing account settings, with the following features:

### 📋 Account Menu Structure

The account menu shows the logged-in user's email at the top, followed by these options:

1. **Upgrade plan** - Upgrade to premium features
2. **Customize AI** - Personalize AI behavior and responses  
3. **Settings** - Access comprehensive settings panel
4. **Help** - Access help resources with submenu
5. **Log out** - Sign out of the account

### ⚙️ Settings Panel

The settings panel displays a vertical list of options with icons:

- **General** (gear icon) - Theme, language, and app behavior
- **Notifications** (bell icon) - Email, push, and system notifications
- **Personalization** (clock icon) - AI personality and response customization
- **Connected apps** (four-dots icon) - Third-party integrations management
- **Data controls** (database gear icon) - Privacy, retention, and data management
- **Security** (lock icon) - Password, 2FA, and session management
- **Account** (user icon) - Profile information and billing

Each settings section has a close (X) button at the top-left corner.

### 🆘 Help Submenu

The help submenu contains these options with icons:

- **Help center** (question mark icon) - Support articles and guides
- **Release notes** (paper and pen icon) - Latest updates and features
- **Terms & policies** (document icon) - Legal documents
- **Keyboard shortcuts** (lightning icon) - Shortcuts reference

## 🔧 Implementation

### Basic Usage

```typescript
import { AccountMenu } from '@/components/ui/account-menu'

function Header() {
  return (
    <div className="header">
      <AccountMenu 
        userEmail="user@example.com"
        userName="John Doe"
        userAvatar="/avatar.jpg" // Optional
      />
    </div>
  )
}
```

### Settings Components

Each settings section is a standalone component that can be used independently:

```typescript
// Individual settings components
import { GeneralSettings } from '@/components/ui/settings/general-settings'
import { NotificationSettings } from '@/components/ui/settings/notification-settings'
import { PersonalizationSettings } from '@/components/ui/settings/personalization-settings'
import { ConnectedAppsSettings } from '@/components/ui/settings/connected-apps-settings'
import { DataControlsSettings } from '@/components/ui/settings/data-controls-settings'
import { SecuritySettings } from '@/components/ui/settings/security-settings'
import { AccountSettings } from '@/components/ui/settings/account-settings'

// Help components
import { HelpCenter } from '@/components/ui/settings/help-center'
import { ReleaseNotes } from '@/components/ui/settings/release-notes'
import { TermsPolicies } from '@/components/ui/settings/terms-policies'
import { KeyboardShortcuts } from '@/components/ui/settings/keyboard-shortcuts'
```

## 🎨 Features by Section

### General Settings
- **Theme control**: Light, dark, system
- **Language selection**: Multiple languages
- **Font size**: Customizable text size
- **App behavior**: Auto-save, auto-update settings

### Notifications
- **Email notifications**: Toggle email alerts
- **Push notifications**: Mobile/desktop notifications
- **Sound notifications**: Audio alerts
- **Quiet hours**: Schedule notification breaks
- **Test notifications**: Send test alerts

### Personalization
- **AI Personality**: Helpful, professional, casual, creative, analytical, custom
- **Response Style**: Concise, balanced, detailed, conversational
- **Custom prompts**: Define AI behavior
- **Display names**: Customize user and AI names
- **Quick presets**: Pre-configured personality combinations

### Connected Apps
- **Integration management**: GitHub, Slack, Notion, Figma, Trello, etc.
- **Permission control**: Manage app permissions
- **Auto-sync**: Enable/disable automatic synchronization
- **Security settings**: Approval requirements for new permissions

### Data Controls
- **Data retention**: Configure automatic deletion periods
- **Privacy controls**: Conversation history, search history
- **Data export**: Download your data in various formats
- **Compliance**: GDPR, CCPA compliance information

### Security
- **Password management**: Change passwords securely
- **Two-factor authentication**: Enable/disable 2FA
- **Session management**: View and terminate active sessions
- **Login notifications**: Security alerts and notifications

### Account Settings
- **Profile information**: Name, bio, location, timezone
- **Contact information**: Email and phone verification
- **Subscription management**: Plan details and billing
- **Danger zone**: Account deletion options

## 🔧 Customization

### Theming
The components use CSS custom properties and can be themed using your design system:

```css
:root {
  --primary: /* your primary color */;
  --secondary: /* your secondary color */;
  --muted: /* your muted color */;
  /* ... other design tokens */
}
```

### Event Handlers
Customize the behavior by implementing event handlers:

```typescript
<AccountMenu 
  userEmail="user@example.com"
  userName="John Doe"
  onUpgradePlan={() => {
    // Handle upgrade plan logic
    window.location.href = '/upgrade'
  }}
  onCustomizeAi={() => {
    // Handle AI customization
    console.log('Opening AI customization')
  }}
  onLogout={() => {
    // Handle logout logic
    signOut()
  }}
/>
```

## 📱 Responsive Design

The account menu system is fully responsive:

- **Desktop**: Full dropdown menu with submenus
- **Mobile**: Touch-friendly interface with appropriate sizing
- **Tablet**: Optimized for medium screen sizes

## ♿ Accessibility

- **Keyboard navigation**: Full keyboard support
- **Screen reader compatibility**: Proper ARIA labels
- **Focus management**: Logical tab order
- **High contrast**: Supports dark/light themes

## 🎯 Integration

The account menu integrates seamlessly with:

- **Authentication systems**: Works with any auth provider
- **Design systems**: shadcn/ui components
- **State management**: React hooks and context
- **Routing**: Next.js App Router compatible

## 📚 Example Implementation

See the main page implementation in `src/app/page.tsx` for a complete working example of how the account menu is integrated into the application header.