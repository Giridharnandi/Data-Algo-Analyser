import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FileText, Info, BarChart2, CheckCircle } from "lucide-react";
import { AnalysisResult } from "@/lib/fileAnalyzer";

interface FileAnalysisResultProps {
  analysisResult: AnalysisResult;
  onContinue: () => void;
}

const FileAnalysisResult: React.FC<FileAnalysisResultProps> = ({
  analysisResult,
  onContinue,
}) => {
  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>File Analysis Complete</CardTitle>
            <CardDescription>
              Analysis results and recommendations
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Summary</h3>
          </div>
          <p>{analysisResult.summary}</p>
        </div>

        {/* File Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/20 rounded-md">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              File Type
            </h4>
            <p className="font-medium">
              {analysisResult.fileType.toUpperCase()}
            </p>
          </div>
          <div className="p-3 bg-muted/20 rounded-md">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              File Size
            </h4>
            <p className="font-medium">{analysisResult.fileSize}</p>
          </div>
          {analysisResult.rowCount !== undefined && (
            <div className="p-3 bg-muted/20 rounded-md">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Rows
              </h4>
              <p className="font-medium">
                {analysisResult.rowCount.toLocaleString()}
              </p>
            </div>
          )}
          {analysisResult.columnCount !== undefined && (
            <div className="p-3 bg-muted/20 rounded-md">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Columns
              </h4>
              <p className="font-medium">
                {analysisResult.columnCount.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Data Types */}
        {analysisResult.dataTypes &&
          Object.keys(analysisResult.dataTypes).length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Data Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(analysisResult.dataTypes).map(
                  ([column, type]) => (
                    <div
                      key={column}
                      className="flex items-center justify-between p-2 bg-muted/10 rounded border"
                    >
                      <span className="text-sm truncate" title={column}>
                        {column}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {type}
                      </Badge>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {/* Sample Data */}
        {analysisResult.sampleData && analysisResult.sampleData.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Sample Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    {analysisResult.headers?.map((header) => (
                      <th key={header} className="p-2 text-left border">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.sampleData.map((row, index) => (
                    <tr key={index} className="border-b">
                      {analysisResult.headers?.map((header) => (
                        <td key={`${index}-${header}`} className="p-2 border">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics */}
        {analysisResult.statistics &&
          Object.keys(analysisResult.statistics).length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysisResult.statistics).map(
                  ([field, stats]) => (
                    <Card key={field} className="overflow-hidden">
                      <CardHeader className="py-2 px-4 bg-muted/20">
                        <CardTitle className="text-sm">{field}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {typeof stats === "object" ? (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(stats).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">
                                  {key}:{" "}
                                </span>
                                <span className="font-medium">
                                  {typeof value === "number"
                                    ? value.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      })
                                    : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{stats}</p>
                        )}
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </div>
          )}

        {/* Recommendations */}
        {analysisResult.recommendations &&
          analysisResult.recommendations.length > 0 && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="h-5 w-5 text-primary" />
                <h3 className="font-medium">
                  Recommended Algorithms & Outputs
                </h3>
              </div>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </CardContent>

      <CardFooter className="flex justify-end pt-2">
        <Button onClick={onContinue} className="gap-2">
          Continue to Algorithm Selection
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileAnalysisResult;
