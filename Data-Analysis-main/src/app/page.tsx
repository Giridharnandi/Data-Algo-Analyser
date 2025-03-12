"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FileUploadArea from "@/components/upload/FileUploadArea";
import AlgorithmSelectionPanel from "@/components/algorithms/AlgorithmSelectionPanel";
import OutputConfigurationPanel from "@/components/output/OutputConfigurationPanel";
import ProcessingDashboard from "@/components/processing/ProcessingDashboard";
import ResultsViewer from "@/components/results/ResultsViewer";
import FileAnalysisResult from "@/components/upload/FileAnalysisResult";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { analyzeFile, AnalysisResult } from "@/lib/fileAnalyzer";
import { generateResults } from "@/lib/resultGenerator";

export default function Home() {
  const { toast } = useToast();

  // State for tracking the current step in the workflow
  const [currentStep, setCurrentStep] = useState<number>(1);

  // State for file upload
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileAnalysis, setFileAnalysis] = useState<AnalysisResult | null>(null);

  // State for algorithm selection
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("");

  // State for output configuration
  const [outputConfig, setOutputConfig] = useState<any>({});

  // State for processing
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "completed" | "error"
  >("idle");

  // State for results
  const [results, setResults] = useState<any[]>([]);

  // Handle file upload
  const handleFilesUploaded = async (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);

    // Real upload process
    if (uploadedFiles.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);

      // Progress simulation - in a real app, this would come from the upload API
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            // Cap at 95% until processing is complete
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      try {
        // Analyze the actual uploaded file
        const result = await analyzeFile(uploadedFiles[0]);
        setFileAnalysis(result);

        toast({
          title: "File Analysis Complete",
          description: `Successfully analyzed ${uploadedFiles[0].name}`,
        });
      } catch (error) {
        console.error("Error analyzing file:", error);
        toast({
          title: "Analysis Error",
          description:
            error instanceof Error
              ? error.message
              : "There was a problem analyzing your file",
          variant: "destructive",
        });
      } finally {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(100);
        // Don't automatically move to next step - show analysis first
      }
    }
  };

  // Handle continuing to algorithm selection after file analysis
  const handleContinueToAlgorithms = () => {
    setCurrentStep(2); // Move to algorithm selection
  };

  // Handle navigation to a specific step
  const handleNavigateToStep = (step: number) => {
    // Validate if we can navigate to this step
    if (step === 2 && !fileAnalysis) {
      toast({
        title: "Cannot proceed",
        description: "Please upload and analyze a file first",
        variant: "destructive",
      });
      return;
    }

    if (step === 3 && !selectedAlgorithm) {
      toast({
        title: "Cannot proceed",
        description: "Please select an algorithm first",
        variant: "destructive",
      });
      return;
    }

    if (step === 4) {
      toast({
        title: "Starting processing",
        description: "Initiating data processing with selected configuration",
      });
      setProcessingStatus("processing");
    }

    if (step === 5 && results.length === 0) {
      toast({
        title: "No results available",
        description: "Please complete the processing step first",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(step);
  };

  // Handle algorithm selection
  const handleAlgorithmSelect = (algorithm: any) => {
    setSelectedAlgorithm(algorithm.id);
    setCurrentStep(3); // Move to output configuration
  };

  // Handle output configuration
  const handleOutputConfig = (config: any) => {
    setOutputConfig(config);
    setCurrentStep(4); // Move to processing

    // Start processing with the actual file data
    setProcessingStatus("processing");

    // In a real implementation, this would call a backend API
    // For now, we'll process based on the selected algorithm and output config
    const processingTime = files[0]?.size > 1000000 ? 8000 : 5000; // Larger files take longer

    setTimeout(() => {
      // Generate actual results based on the file analysis, algorithm and output config
      const generatedResults = generateResults(
        fileAnalysis,
        selectedAlgorithm,
        config,
      );
      setResults(generatedResults);
      setProcessingStatus("completed");
      setCurrentStep(5); // Move to results
    }, processingTime);
  };

  // Handle processing cancellation
  const handleCancelProcessing = () => {
    setProcessingStatus("idle");
    setCurrentStep(3); // Go back to output configuration
  };

  // Handle processing retry
  const handleRetryProcessing = () => {
    setProcessingStatus("processing");
    // Simulate processing again
    setTimeout(() => {
      setProcessingStatus("completed");
      setCurrentStep(5); // Move to results
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Data Analysis Platform
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload your data, select algorithms, and generate insights
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  onClick={() => handleNavigateToStep(step)}
                  title={
                    [
                      "File Upload",
                      "Algorithm Selection",
                      "Output Configuration",
                      "Processing",
                      "Results",
                    ][step - 1]
                  }
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-12 h-1 ${currentStep > step ? "bg-primary" : "bg-muted"}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <FileUploadArea
              onFilesUploaded={handleFilesUploaded}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />

            {fileAnalysis && !isUploading && (
              <FileAnalysisResult
                analysisResult={fileAnalysis}
                onContinue={handleContinueToAlgorithms}
              />
            )}
          </div>
        )}

        {/* Step 2: Algorithm Selection */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <AlgorithmSelectionPanel
              onSelect={handleAlgorithmSelect}
              selectedAlgorithm={selectedAlgorithm}
            />
          </div>
        )}

        {/* Step 3: Output Configuration */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <OutputConfigurationPanel
              onConfigurationComplete={handleOutputConfig}
            />
          </div>
        )}

        {/* Step 4: Processing Dashboard */}
        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto">
            <ProcessingDashboard
              processingStatus={processingStatus}
              onCancel={handleCancelProcessing}
              onRetry={handleRetryProcessing}
            />
          </div>
        )}

        {/* Step 5: Results Viewer */}
        {currentStep === 5 && (
          <div className="max-w-6xl mx-auto">
            <ResultsViewer results={results} />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between max-w-4xl mx-auto mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => handleNavigateToStep(currentStep - 1)}
            >
              Previous Step
            </Button>
          )}

          {currentStep === 5 && (
            <Button variant="outline" onClick={() => handleNavigateToStep(1)}>
              Start New Analysis
            </Button>
          )}

          {currentStep < 5 && (
            <Button
              variant="default"
              onClick={() => handleNavigateToStep(currentStep + 1)}
              disabled={currentStep === 1 && files.length === 0}
              className={
                currentStep === 1 && files.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              Next Step
            </Button>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
