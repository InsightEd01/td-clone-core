# Mobile Installation System

## PWA Manifest Configuration
```typescript
VitePWA({
  manifest: {
    name: 'GCB — Mobile Banking',
    short_name: 'GCB',
    description: 'Mobile-first banking web app: balances, transfers, bills, and insights.',
    theme_color: '#10b981',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    categories: ['finance', 'business'],
    icons: [
      { src: 'manifest-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'manifest-icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'manifest-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  }
})
```

## Installation Event Handling

### BeforeInstallPrompt Interface
```typescript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string; }>;
  prompt(): Promise<void>;
}
```

### useInstallPrompt Hook
```typescript
export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('Error installing app:', error);
    }
  };

  const dismissPrompt = () => setIsInstallable(false);

  return { isInstallable, installApp, dismissPrompt };
}
```

### InstallPrompt Component
```typescript
export function InstallPrompt() {
  const { isInstallable, installApp, dismissPrompt } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" />
              Install GCB
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={dismissPrompt} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Install the app for a better experience with offline access.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button size="sm" onClick={installApp} className="w-full">Install App</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Installation Flow

### PWA Criteria Detection
```javascript
// Browser checks:
// 1. HTTPS/localhost served
// 2. Valid manifest.json with required fields  
// 3. Service worker registered and active
// 4. User engagement heuristics satisfied
// → Fires 'beforeinstallprompt' event
```

### Installation Process
```typescript
// 1. Event captured and prevented
e.preventDefault();

// 2. Custom prompt shown
setInstallPrompt(e);
setIsInstallable(true);

// 3. User clicks install
await installPrompt.prompt();

// 4. Browser shows native dialog
const { outcome } = await installPrompt.userChoice;

// 5. App installed to home screen (if accepted)
if (outcome === 'accepted') {
  setInstallPrompt(null);
  setIsInstallable(false);
}
```

### App Integration
```typescript
// App.tsx
<InstallPrompt />      // z-50, top-4 left-4 right-4
<PWAUpdatePrompt />    // z-50, bottom-4 right-4
```

## Platform Support

### Android Chrome
- Full `beforeinstallprompt` API support
- Custom install UI via `prompt()` method
- Native install dialog after custom prompt

### iOS Safari  
- No `beforeinstallprompt` event
- Manual "Add to Home Screen" via share menu
- Limited PWA features

### Desktop Chrome/Edge
- Install button in address bar
- `beforeinstallprompt` event support
- Full PWA functionality