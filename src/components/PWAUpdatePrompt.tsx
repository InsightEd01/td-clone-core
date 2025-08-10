import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePWA } from "@/hooks/usePWA";
import { Download, Wifi, WifiOff } from "lucide-react";

export function PWAUpdatePrompt() {
  const { needRefresh, offlineReady, updateServiceWorker, close } = usePWA();

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {needRefresh ? (
              <>
                <Download className="h-4 w-4" />
                Update Available
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                App Ready Offline
              </>
            )}
          </CardTitle>
          <CardDescription className="text-xs">
            {needRefresh
              ? "A new version is available. Refresh to update."
              : "App is ready to work offline."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {needRefresh && (
              <Button
                size="sm"
                onClick={() => updateServiceWorker(true)}
                className="flex-1"
              >
                Update
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={close}
              className="flex-1"
            >
              {needRefresh ? "Later" : "OK"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}