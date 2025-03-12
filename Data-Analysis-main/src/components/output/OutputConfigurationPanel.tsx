import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { FileText, Music, Video, BarChart2, Database } from "lucide-react";

interface OutputOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface OutputConfigurationPanelProps {
  onConfigurationComplete?: (config: OutputConfiguration) => void;
  selectedFormat?: string;
  initialConfig?: Partial<OutputConfiguration>;
}

interface OutputConfiguration {
  format: string;
  options: Record<string, any>;
}

const OutputConfigurationPanel = ({
  onConfigurationComplete = () => {},
  selectedFormat = "text",
  initialConfig = {},
}: OutputConfigurationPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>(selectedFormat);
  const [configuration, setConfiguration] = useState<OutputConfiguration>({
    format: selectedFormat,
    options: initialConfig.options || {},
  });

  const outputOptions: OutputOption[] = [
    {
      id: "text",
      name: "Text",
      description: "Generate insights as formatted text reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "audio",
      name: "Audio",
      description: "Convert insights to spoken audio format",
      icon: <Music className="h-5 w-5" />,
    },
    {
      id: "video",
      name: "Video",
      description: "Create animated video presentations of insights",
      icon: <Video className="h-5 w-5" />,
    },
    {
      id: "graph",
      name: "Graph",
      description: "Visualize insights with interactive charts",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      id: "data",
      name: "Data",
      description: "Export raw data in various file formats",
      icon: <Database className="h-5 w-5" />,
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setConfiguration((prev) => ({
      ...prev,
      format: value,
    }));
  };

  const handleOptionChange = (optionKey: string, value: any) => {
    setConfiguration((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: value,
      },
    }));
  };

  const handleSubmit = () => {
    onConfigurationComplete(configuration);
  };

  return (
    <Card className="w-full max-w-[1200px] mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Output Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Select Output Format</h3>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="w-full justify-start mb-6 overflow-x-auto">
                {outputOptions.map((option) => (
                  <TabsTrigger
                    key={option.id}
                    value={option.id}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    {option.icon}
                    {option.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Text Output Options */}
              <TabsContent value="text" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Report Format</h4>
                    <RadioGroup
                      defaultValue={
                        configuration.options.textFormat || "detailed"
                      }
                      className="flex flex-col space-y-2"
                      onValueChange={(value) =>
                        handleOptionChange("textFormat", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="summary" id="summary" />
                        <label htmlFor="summary" className="text-sm">
                          Summary (Concise overview)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <label htmlFor="detailed" className="text-sm">
                          Detailed (Comprehensive analysis)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technical" id="technical" />
                        <label htmlFor="technical" className="text-sm">
                          Technical (In-depth with statistics)
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Include Sections</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="executive-summary"
                          defaultChecked={
                            configuration.options.includeSummary !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeSummary",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="executive-summary" className="text-sm">
                          Executive Summary
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="methodology"
                          defaultChecked={
                            configuration.options.includeMethodology !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeMethodology",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="methodology" className="text-sm">
                          Methodology
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="data-insights"
                          defaultChecked={
                            configuration.options.includeInsights !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeInsights",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="data-insights" className="text-sm">
                          Data Insights
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="recommendations"
                          defaultChecked={
                            configuration.options.includeRecommendations !==
                            false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeRecommendations",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="recommendations" className="text-sm">
                          Recommendations
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Audio Output Options */}
              <TabsContent value="audio" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Voice Type</h4>
                    <RadioGroup
                      defaultValue={
                        configuration.options.voiceType || "neutral"
                      }
                      className="flex flex-col space-y-2"
                      onValueChange={(value) =>
                        handleOptionChange("voiceType", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="neutral" id="neutral" />
                        <label htmlFor="neutral" className="text-sm">
                          Neutral
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="professional"
                          id="professional"
                        />
                        <label htmlFor="professional" className="text-sm">
                          Professional
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="friendly" id="friendly" />
                        <label htmlFor="friendly" className="text-sm">
                          Friendly
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Audio Quality</h4>
                    <select
                      className="w-full p-2 border rounded-md"
                      defaultValue={
                        configuration.options.audioQuality || "standard"
                      }
                      onChange={(e) =>
                        handleOptionChange("audioQuality", e.target.value)
                      }
                    >
                      <option value="standard">Standard (128kbps)</option>
                      <option value="high">High (256kbps)</option>
                      <option value="premium">Premium (320kbps)</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              {/* Video Output Options */}
              <TabsContent value="video" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Video Style</h4>
                    <RadioGroup
                      defaultValue={
                        configuration.options.videoStyle || "presentation"
                      }
                      className="flex flex-col space-y-2"
                      onValueChange={(value) =>
                        handleOptionChange("videoStyle", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="presentation"
                          id="presentation"
                        />
                        <label htmlFor="presentation" className="text-sm">
                          Presentation Style
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="animated" id="animated" />
                        <label htmlFor="animated" className="text-sm">
                          Animated Graphics
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <label htmlFor="minimal" className="text-sm">
                          Minimal Data Focus
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Resolution</h4>
                    <select
                      className="w-full p-2 border rounded-md"
                      defaultValue={
                        configuration.options.videoResolution || "hd"
                      }
                      onChange={(e) =>
                        handleOptionChange("videoResolution", e.target.value)
                      }
                    >
                      <option value="sd">Standard Definition (480p)</option>
                      <option value="hd">High Definition (720p)</option>
                      <option value="fullhd">Full HD (1080p)</option>
                      <option value="4k">4K Ultra HD</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              {/* Graph Output Options */}
              <TabsContent value="graph" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Chart Types</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="bar-charts"
                          defaultChecked={
                            configuration.options.includeBarCharts !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeBarCharts",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="bar-charts" className="text-sm">
                          Bar Charts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="line-charts"
                          defaultChecked={
                            configuration.options.includeLineCharts !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeLineCharts",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="line-charts" className="text-sm">
                          Line Charts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pie-charts"
                          defaultChecked={
                            configuration.options.includePieCharts !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includePieCharts",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="pie-charts" className="text-sm">
                          Pie Charts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="scatter-plots"
                          defaultChecked={
                            configuration.options.includeScatterPlots !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeScatterPlots",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="scatter-plots" className="text-sm">
                          Scatter Plots
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Interactivity</h4>
                    <RadioGroup
                      defaultValue={
                        configuration.options.graphInteractivity || "basic"
                      }
                      className="flex flex-col space-y-2"
                      onValueChange={(value) =>
                        handleOptionChange("graphInteractivity", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="static" id="static" />
                        <label htmlFor="static" className="text-sm">
                          Static (Non-interactive)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <label htmlFor="basic" className="text-sm">
                          Basic (Hover tooltips)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <label htmlFor="advanced" className="text-sm">
                          Advanced (Filtering, zooming, etc.)
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>

              {/* Data Output Options */}
              <TabsContent value="data" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">File Format</h4>
                    <RadioGroup
                      defaultValue={configuration.options.dataFormat || "csv"}
                      className="flex flex-col space-y-2"
                      onValueChange={(value) =>
                        handleOptionChange("dataFormat", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="csv" id="csv" />
                        <label htmlFor="csv" className="text-sm">
                          CSV (Comma Separated Values)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="json" id="json" />
                        <label htmlFor="json" className="text-sm">
                          JSON (JavaScript Object Notation)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excel" id="excel" />
                        <label htmlFor="excel" className="text-sm">
                          Excel (.xlsx)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sql" id="sql" />
                        <label htmlFor="sql" className="text-sm">
                          SQL (Database Export)
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Data Processing</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-raw"
                          defaultChecked={
                            configuration.options.includeRawData !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeRawData",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="include-raw" className="text-sm">
                          Include Raw Data
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-processed"
                          defaultChecked={
                            configuration.options.includeProcessedData !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeProcessedData",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="include-processed" className="text-sm">
                          Include Processed Data
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-metadata"
                          defaultChecked={
                            configuration.options.includeMetadata !== false
                          }
                          onChange={(e) =>
                            handleOptionChange(
                              "includeMetadata",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="include-metadata" className="text-sm">
                          Include Metadata
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Apply Configuration</Button>
      </CardFooter>
    </Card>
  );
};

export default OutputConfigurationPanel;
