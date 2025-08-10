import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, X } from "lucide-react";

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
              Install GreenBank
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={dismissPrompt}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Install the app for a better experience with offline access.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            size="sm"
            onClick={installApp}
            className="w-full"
          >
            Install App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}