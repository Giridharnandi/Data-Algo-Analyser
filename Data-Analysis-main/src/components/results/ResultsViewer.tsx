import React, { useState } from "react";
import {
  Download,
  Share2,
  BarChart,
  FileText,
  Music,
  Video,
  Database,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ResultsViewerProps {
  results?: {
    id: string;
    title: string;
    type: "text" | "audio" | "video" | "graph" | "data";
    content: any;
    timestamp: string;
  }[];
  onDownload?: (resultId: string) => void;
  onShare?: (resultId: string, options: any) => void;
}

const ResultsViewer = ({
  results = [],

  onDownload = (id) => {
    // Find the result by id
    const result = results.find((r) => r.id === id);
    if (!result) return;

    // Create downloadable content based on result type
    let content = "";
    let filename = `${result.title.replace(/\s+/g, "_")}.txt`;
    let mimeType = "text/plain";

    if (result.type === "text") {
      content = result.content;
    } else if (result.type === "data") {
      content = JSON.stringify(result.content.data, null, 2);
      filename = `${result.title.replace(/\s+/g, "_")}.json`;
      mimeType = "application/json";
    } else if (result.type === "graph") {
      content = JSON.stringify(result.content, null, 2);
      filename = `${result.title.replace(/\s+/g, "_")}_graph_data.json`;
      mimeType = "application/json";
    } else {
      content = `${result.title}\n\nThis content type (${result.type}) would be downloadable in a production environment.`;
    }

    // Create a blob and download it
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  onShare = (id, options) =>
    console.log(`Sharing result ${id} with options:`, options),
}: ResultsViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter results based on active tab
  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter((result) => result.type === activeTab);

  // Get icon based on result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-5 w-5" />;
      case "audio":
        return <Music className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "graph":
        return <BarChart className="h-5 w-5" />;
      case "data":
        return <Database className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Render content based on result type
  const renderResultContent = (result: any) => {
    switch (result.type) {
      case "text":
        return (
          <div className="p-4 bg-muted/50 rounded-md whitespace-pre-line">
            {result.content}
          </div>
        );
      case "graph":
        return (
          <div className="p-4 bg-muted/50 rounded-md h-64">
            {result.content && result.content.series ? (
              <div className="h-full w-full">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">
                    {result.content.title}
                  </h3>
                  <div className="flex gap-2">
                    {result.content.series.map((series: any, i: number) => (
                      <div key={i} className="flex items-center gap-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: `hsl(var(--chart-${i + 1}))`,
                          }}
                        ></div>
                        <span className="text-xs">{series.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[calc(100%-30px)] w-full flex items-end justify-between gap-1">
                  {result.content.labels.map((label: string, i: number) => (
                    <div key={i} className="flex flex-col items-center h-full">
                      <div className="flex-1 w-full flex items-end justify-center gap-1">
                        {result.content.series.map(
                          (series: any, seriesIndex: number) => {
                            const value = series.data[i] || 0;
                            const maxValue = Math.max(...series.data);
                            const height =
                              maxValue > 0 ? (value / maxValue) * 100 : 0;
                            return (
                              <div
                                key={seriesIndex}
                                className="w-4 rounded-t-sm"
                                style={{
                                  height: `${height}%`,
                                  backgroundColor: `hsl(var(--chart-${seriesIndex + 1}))`,
                                }}
                                title={`${series.name}: ${value}`}
                              ></div>
                            );
                          },
                        )}
                      </div>
                      <div
                        className="text-xs mt-1 truncate max-w-[60px]"
                        title={label}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <BarChart className="h-32 w-32 text-muted-foreground" />
                <p className="ml-4">No graph data available</p>
              </div>
            )}
          </div>
        );
      case "data":
        return (
          <div className="p-4 bg-muted/50 rounded-md overflow-auto">
            {result.content &&
            result.content.data &&
            result.content.data.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    {Object.keys(result.content.data[0]).map((header) => (
                      <th key={header} className="text-left p-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.content.data.map((row: any, i: number) => (
                    <tr key={i} className="border-b">
                      {Object.entries(row).map(([key, value]) => (
                        <td key={`${i}-${key}`} className="p-2">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">No Data Available</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">No processed data to display</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        );
      case "audio":
        return (
          <div className="p-4 bg-muted/50 rounded-md flex items-center justify-center">
            <Music className="h-10 w-10 text-muted-foreground" />
            <div className="ml-4">
              <p>Audio player would appear here</p>
              <div className="w-full bg-secondary h-2 rounded-full mt-2">
                <div className="bg-primary h-2 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="p-4 bg-muted/50 rounded-md h-64 flex flex-col items-center justify-center">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <p>Video player would appear here</p>
            <div className="w-full max-w-md bg-secondary h-2 rounded-full mt-4">
              <div className="bg-primary h-2 rounded-full w-1/4"></div>
            </div>
          </div>
        );
      default:
        return <p>Unknown result type</p>;
    }
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Results Viewer</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => results.forEach((result) => onDownload(result.id))}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share All
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="graph">Graphs</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <Card key={result.id} className="overflow-hidden bg-card">
                <CardHeader className="bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getResultIcon(result.type)}
                      <CardTitle className="ml-2">{result.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(result.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              onShare(result.id, { type: "email" })
                            }
                          >
                            Share via Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onShare(result.id, { type: "link" })}
                          >
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onShare(result.id, { type: "export" })
                            }
                          >
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {renderResultContent(result)}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground justify-between">
                  <span>
                    Generated: {new Date(result.timestamp).toLocaleString()}
                  </span>
                  <span>
                    Type:{" "}
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </span>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                There are no results matching the selected filter. Try selecting
                a different category or process a new file.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsViewer;
