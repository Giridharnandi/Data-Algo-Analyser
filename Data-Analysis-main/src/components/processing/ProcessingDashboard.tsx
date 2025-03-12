import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface ProcessingDashboardProps {
  processingStatus?: "idle" | "processing" | "completed" | "error";
  progress?: number;
  estimatedTimeRemaining?: number;
  processingDetails?: {
    fileName?: string;
    algorithm?: string;
    outputFormat?: string;
    startTime?: string;
  };
  onCancel?: () => void;
  onRetry?: () => void;
}

const ProcessingDashboard = ({
  processingStatus = "processing",
  progress = 45,
  estimatedTimeRemaining = 120,
  processingDetails = {
    fileName: "dataset.csv",
    algorithm: "Random Forest Classifier",
    outputFormat: "Graph Visualization",
    startTime: new Date().toLocaleTimeString(),
  },
  onCancel = () => console.log("Processing cancelled"),
  onRetry = () => console.log("Retrying processing"),
}: ProcessingDashboardProps) => {
  const [timeRemaining, setTimeRemaining] = useState(estimatedTimeRemaining);

  // Simulate countdown timer when processing
  useEffect(() => {
    if (processingStatus !== "processing" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [processingStatus, timeRemaining]);

  // Format time remaining as minutes:seconds
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Processing Dashboard</CardTitle>
            <CardDescription>
              Monitor the real-time progress of your data processing
            </CardDescription>
          </div>
          {processingStatus === "processing" && (
            <Button variant="destructive" onClick={onCancel}>
              Cancel Processing
            </Button>
          )}
          {processingStatus === "error" && (
            <Button variant="default" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Indicator */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
          {processingStatus === "idle" && (
            <Clock className="h-6 w-6 text-muted-foreground" />
          )}
          {processingStatus === "processing" && (
            <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
          )}
          {processingStatus === "completed" && (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
          {processingStatus === "error" && (
            <AlertCircle className="h-6 w-6 text-red-500" />
          )}

          <div>
            <h3 className="font-medium">
              {processingStatus === "idle" && "Ready to Process"}
              {processingStatus === "processing" && "Processing in Progress"}
              {processingStatus === "completed" && "Processing Complete"}
              {processingStatus === "error" && "Processing Error"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {processingStatus === "idle" &&
                "Your file is ready to be processed"}
              {processingStatus === "processing" &&
                `Estimated time remaining: ${formatTimeRemaining(timeRemaining)}`}
              {processingStatus === "completed" &&
                "Your results are ready to view"}
              {processingStatus === "error" &&
                "An error occurred during processing"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Processing Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              File Name
            </h4>
            <p className="mt-1">{processingDetails.fileName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Algorithm
            </h4>
            <p className="mt-1">{processingDetails.algorithm}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Output Format
            </h4>
            <p className="mt-1">{processingDetails.outputFormat}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Start Time
            </h4>
            <p className="mt-1">{processingDetails.startTime}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          {processingStatus === "processing" && (
            <span>You can cancel this process at any time</span>
          )}
          {processingStatus === "completed" && (
            <span>Processing completed successfully</span>
          )}
          {processingStatus === "error" && (
            <span>
              Please try again or contact support if the issue persists
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProcessingDashboard;
