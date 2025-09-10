"use client";
import React, { useState } from "react";
import useCurrentPlan from "@/lib/users/useCurrentPlan";
import useGoogleAccount from "@/hooks/useGoogleAccount";
import useUserName from "@/hooks/useUserName";
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, Calendar, AlertTriangle, Settings, Upload, MessageCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { signIn } from "next-auth/react";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { CanvasIntegrationModal } from "@/components/canvas/canvas-integration-modal";
import { ClassCard } from "@/components/classes/class-card";
import { WeeklyBreakdown } from "@/components/dashboard/weekly-breakdown";

interface Class {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
  assignments: {
    id: string;
    name: string;
    dueDate: string;
    description?: string;
    completed: boolean;
  }[];
}

function AppHomepage() {
  const { currentPlan } = useCurrentPlan();
  const { userName, isLoading: userNameLoading } = useUserName();
  const [showGoogleStatus, setShowGoogleStatus] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { googleAccount, isLoading: googleAccountLoading } = useGoogleAccount(showGoogleStatus);
  
  // Get classes data from context
  const { classes, classesError, mutateClasses } = useAppData();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Add a timestamp to force fresh OAuth flow and account update
      const timestamp = Date.now();
      await signIn("google", {
        callbackUrl: `/app?reauth=${timestamp}`,
      });
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Check if we just came back from reauthentication
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reauth')) {
      // The auth callback will have already updated the tokens and scopes
      // Just refresh the page to show updated status
      window.location.href = '/app';
    }
  }, []);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-12 pt-8">
        <div className="bg-gray-100 rounded-md p-3">
          <h1 className="text-3xl font-bold ">
            Howdy, {userNameLoading ? "..." : userName || "User"} 👋
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <CanvasIntegrationModal>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </CanvasIntegrationModal>
          
          <Link href="/app/classes">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </Link>
          
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Duey
          </Button>
          
          {!currentPlan || currentPlan.default ? (
            <Link href="/#pricing">
              <Button>
                <CreditCardIcon className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </Link>
          ) : (
            <Link href="/app/billing">
              <Button>
                <CreditCardIcon className="w-4 h-4 mr-2" />
                Manage Subscription
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-12 py-8 space-y-6">
        {/* Weekly Breakdown */}
        {classes.length > 0 && (
          <WeeklyBreakdown classes={classes} />
        )}
        
        {classesError ? (
          <div className="text-center text-red-600">
            Failed to load classes. Please try again.
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No classes yet</h3>
            <p className="text-muted-foreground mb-4">
              Import your assignments to get started
            </p>
            <CanvasIntegrationModal />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((classData) => (
              <div key={classData.id} className="h-full">
                <ClassCard 
                  classData={classData} 
                  onUpdate={mutateClasses}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Account Status - Collapsible (Hidden by default) */}
      <Collapsible open={showGoogleStatus} onOpenChange={setShowGoogleStatus}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-fit m-6">
            <Settings className="w-4 h-4 mr-2" />
            Google Calendar Settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mx-6 mb-6">
          {googleAccountLoading ? (
            <div className="text-sm text-muted-foreground">Checking Google account...</div>
          ) : googleAccount ? (
            <div className="space-y-3">
              {googleAccount.hasGoogleAccount ? (
                googleAccount.needsReauth ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span>
                          Your Google account needs to be reconnected to access Calendar features.
                        </span>
                        <Button 
                          size="sm" 
                          onClick={handleGoogleSignIn}
                          disabled={isGoogleLoading}
                        >
                          {isGoogleLoading ? (
                            <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <FaGoogle className="w-4 h-4 mr-2" />
                          )}
                          Reconnect Google
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Google Calendar access is connected and ready to use.
                    </AlertDescription>
                  </Alert>
                )
              ) : (
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>
                        Connect your Google account to access Calendar features.
                      </span>
                      <Button 
                        size="sm" 
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                      >
                        {isGoogleLoading ? (
                          <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FaGoogle className="w-4 h-4 mr-2" />
                        )}
                        Connect Google
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Unable to check Google account status.</div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default AppHomepage;
