/**
 * Utility for generating results based on file analysis, selected algorithm and output configuration
 */
import { AnalysisResult } from "./fileAnalyzer";

/**
 * Generates results based on file analysis, selected algorithm and output configuration
 */
export function generateResults(
  fileAnalysis: AnalysisResult | null,
  algorithmId: string,
  outputConfig: any,
): any[] {
  if (!fileAnalysis) return [];

  const results = [];
  const timestamp = new Date().toISOString();
  const fileName = "Analyzed File";

  // Generate results based on the output format
  const format = outputConfig.format || "text";

  // Text result (always included)
  results.push({
    id: `text-${Date.now()}`,
    title: `${getAlgorithmName(algorithmId)} Analysis Results`,
    type: "text",
    content: generateTextResult(fileAnalysis, algorithmId, outputConfig),
    timestamp,
  });

  // Generate additional results based on selected format
  if (format === "graph" || outputConfig.options?.includeGraphs) {
    results.push({
      id: `graph-${Date.now()}`,
      title: `${getAlgorithmName(algorithmId)} Visualization`,
      type: "graph",
      content: generateGraphData(fileAnalysis, algorithmId, outputConfig),
      timestamp,
    });
  }

  if (format === "data" || outputConfig.options?.includeData) {
    results.push({
      id: `data-${Date.now()}`,
      title: `${getAlgorithmName(algorithmId)} Data Output`,
      type: "data",
      content: generateDataOutput(fileAnalysis, algorithmId, outputConfig),
      timestamp,
    });
  }

  if (format === "audio") {
    results.push({
      id: `audio-${Date.now()}`,
      title: `${getAlgorithmName(algorithmId)} Audio Summary`,
      type: "audio",
      content: "audio-content-placeholder", // In a real app, this would be an audio URL
      timestamp,
    });
  }

  if (format === "video") {
    results.push({
      id: `video-${Date.now()}`,
      title: `${getAlgorithmName(algorithmId)} Video Presentation`,
      type: "video",
      content: "video-content-placeholder", // In a real app, this would be a video URL
      timestamp,
    });
  }

  return results;
}

/**
 * Gets the algorithm name based on its ID
 */
function getAlgorithmName(algorithmId: string): string {
  const algorithms: Record<string, string> = {
    "linear-regression": "Linear Regression",
    "decision-tree": "Decision Tree",
    "k-means": "K-Means Clustering",
    "neural-network": "Neural Network",
    "random-forest": "Random Forest",
    xgboost: "XGBoost",
    "time-series": "ARIMA",
  };

  return algorithms[algorithmId] || "Analysis";
}

/**
 * Generates text result based on file analysis and algorithm
 */
function generateTextResult(
  fileAnalysis: AnalysisResult,
  algorithmId: string,
  outputConfig: any,
): string {
  const algorithmName = getAlgorithmName(algorithmId);
  const textFormat = outputConfig.options?.textFormat || "detailed";

  // Generate different content based on the text format
  if (textFormat === "summary") {
    return `The ${algorithmName} algorithm was applied to the ${fileAnalysis.fileType.toUpperCase()} file containing ${fileAnalysis.rowCount || "unknown"} records. The analysis identified key patterns in the data that can be used for prediction and decision-making.`;
  } else if (textFormat === "technical") {
    // Technical format with more details
    let result = `## ${algorithmName} Technical Analysis\n\n`;
    result += `**File Information:**\n- Type: ${fileAnalysis.fileType.toUpperCase()}\n- Size: ${fileAnalysis.fileSize}\n- Records: ${fileAnalysis.rowCount || "N/A"}\n- Fields: ${fileAnalysis.columnCount || "N/A"}\n\n`;

    result += "**Data Types:**\n";
    if (fileAnalysis.dataTypes) {
      Object.entries(fileAnalysis.dataTypes).forEach(([field, type]) => {
        result += `- ${field}: ${type}\n`;
      });
    }

    result += "\n**Statistical Summary:**\n";
    if (fileAnalysis.statistics) {
      Object.entries(fileAnalysis.statistics).forEach(([field, stats]) => {
        result += `- ${field}: `;
        if (typeof stats === "object") {
          result += Object.entries(stats)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
        } else {
          result += stats;
        }
        result += "\n";
      });
    }

    return result;
  } else {
    // Detailed format (default)
    let result = `# ${algorithmName} Analysis Results\n\n`;
    result += `The analysis was performed on a ${fileAnalysis.fileType.toUpperCase()} file containing ${fileAnalysis.rowCount || "unknown"} records and ${fileAnalysis.columnCount || "unknown"} fields.\n\n`;

    result += "## Key Findings\n\n";
    result +=
      "- The data shows significant patterns that can be leveraged for predictive modeling\n";
    result +=
      "- Several outliers were identified that may require further investigation\n";
    result +=
      "- The model achieved good performance metrics on the provided dataset\n\n";

    result += "## Recommendations\n\n";
    if (
      fileAnalysis.recommendations &&
      fileAnalysis.recommendations.length > 0
    ) {
      fileAnalysis.recommendations.forEach((rec) => {
        result += `- ${rec}\n`;
      });
    } else {
      result += "- No specific recommendations available for this dataset\n";
    }

    return result;
  }
}

/**
 * Generates graph data based on file analysis and algorithm
 */
function generateGraphData(
  fileAnalysis: AnalysisResult,
  algorithmId: string,
  outputConfig: any,
): any {
  // In a real application, this would generate actual graph data
  // For now, we'll return a placeholder structure that could be used by a charting library

  const graphData: any = {
    type: "bar", // default chart type
    data: [],
    labels: [],
    title: `${getAlgorithmName(algorithmId)} Results`,
  };

  // If we have statistics, use them for the graph data
  if (fileAnalysis.statistics) {
    const numericFields = Object.keys(fileAnalysis.statistics);

    if (numericFields.length > 0) {
      // For bar charts
      graphData.labels = numericFields;
      graphData.data = numericFields.map((field) => {
        const stats = fileAnalysis.statistics?.[field];
        return stats?.mean || 0;
      });

      // Add some additional series for more interesting charts
      graphData.series = [
        {
          name: "Mean",
          data: numericFields.map((field) => {
            const stats = fileAnalysis.statistics?.[field];
            return stats?.mean || 0;
          }),
        },
        {
          name: "Max",
          data: numericFields.map((field) => {
            const stats = fileAnalysis.statistics?.[field];
            return stats?.max || 0;
          }),
        },
        {
          name: "Min",
          data: numericFields.map((field) => {
            const stats = fileAnalysis.statistics?.[field];
            return stats?.min || 0;
          }),
        },
      ];
    }
  }

  return graphData;
}

/**
 * Generates data output based on file analysis and algorithm
 */
function generateDataOutput(
  fileAnalysis: AnalysisResult,
  algorithmId: string,
  outputConfig: any,
): any {
  // In a real application, this would generate actual processed data
  // For now, we'll return a structure based on the sample data from the file analysis

  const dataFormat = outputConfig.options?.dataFormat || "json";

  // Start with the sample data if available
  const baseData = fileAnalysis.sampleData || [];

  // Add some "processed" fields based on the algorithm
  const processedData = baseData.map((item, index) => {
    const newItem = { ...item };

    // Add algorithm-specific fields
    if (algorithmId === "linear-regression") {
      newItem.predicted_value = Math.random() * 100;
      newItem.error = Math.random() * 10;
    } else if (
      algorithmId === "decision-tree" ||
      algorithmId === "random-forest"
    ) {
      newItem.classification =
        Math.random() > 0.5 ? "Category A" : "Category B";
      newItem.confidence = 0.5 + Math.random() * 0.5;
    } else if (algorithmId === "k-means") {
      newItem.cluster = Math.floor(Math.random() * 3) + 1;
      newItem.distance_to_centroid = Math.random() * 5;
    }

    return newItem;
  });

  return {
    format: dataFormat,
    data: processedData,
    metadata: {
      algorithm: getAlgorithmName(algorithmId),
      processedAt: new Date().toISOString(),
      rowCount: processedData.length,
    },
  };
}
