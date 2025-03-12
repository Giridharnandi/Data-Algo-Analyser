/**
 * File analyzer utility for processing uploaded files
 */

export interface AnalysisResult {
  summary: string;
  rowCount?: number;
  columnCount?: number;
  headers?: string[];
  dataTypes?: Record<string, string>;
  sampleData?: any[];
  statistics?: Record<string, any>;
  fileType: string;
  fileSize: string;
  recommendations?: string[];
}

/**
 * Analyzes a file and returns structured information about its contents
 */
export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const fileType = getFileType(file);
  const fileSize = formatFileSize(file.size);

  // Read the file content
  const content = await readFileContent(file, fileType);

  // Process based on file type
  let result: AnalysisResult = {
    summary: "",
    fileType,
    fileSize,
    recommendations: [],
  };

  switch (fileType) {
    case "csv":
      result = { ...result, ...analyzeCSV(content) };
      break;
    case "json":
      result = { ...result, ...analyzeJSON(content) };
      break;
    case "txt":
      result = { ...result, ...analyzeTXT(content) };
      break;
    case "xlsx":
      result.summary =
        "Excel file detected. Basic metadata analysis available.";
      result.recommendations = [
        "Consider converting to CSV for more detailed analysis",
        "Use Random Forest algorithm for classification tasks",
        "Export as graph visualization for better insights",
      ];
      break;
    default:
      result.summary = "Unsupported file format. Limited analysis available.";
      result.recommendations = [
        "Convert to a supported format (CSV, JSON, TXT)",
      ];
  }

  return result;
}

/**
 * Determines the file type based on extension
 */
function getFileType(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return extension;
}

/**
 * Formats file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Reads file content based on file type
 */
async function readFileContent(file: File, fileType: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result;

        if (typeof content === "string") {
          if (fileType === "json") {
            try {
              resolve(JSON.parse(content));
            } catch (jsonError) {
              console.error("JSON parse error:", jsonError);
              resolve({});
            }
          } else {
            resolve(content);
          }
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Error reading file"));

    if (fileType === "json" || fileType === "csv" || fileType === "txt") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

/**
 * Analyzes CSV file content
 */
function analyzeCSV(content: string): Partial<AnalysisResult> {
  // Split by lines and get headers
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) {
    return {
      summary: "Empty CSV file detected.",
      rowCount: 0,
      columnCount: 0,
    };
  }

  // Assume first line is header
  const headers = lines[0].split(",").map((h) => h.trim());
  const columnCount = headers.length;
  const rowCount = lines.length - 1; // Excluding header

  // Sample data (up to 5 rows)
  const sampleData = lines.slice(1, 6).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return headers.reduce(
      (obj, header, index) => {
        obj[header] = values[index] || "";
        return obj;
      },
      {} as Record<string, string>,
    );
  });

  // Detect data types for each column
  const dataTypes: Record<string, string> = {};
  headers.forEach((header, index) => {
    const values = lines.slice(1).map((line) => line.split(",")[index]?.trim());
    dataTypes[header] = detectDataType(values);
  });

  // Calculate basic statistics for numeric columns
  const statistics: Record<string, any> = {};
  headers.forEach((header, index) => {
    if (dataTypes[header] === "number") {
      const values = lines
        .slice(1)
        .map((line) => parseFloat(line.split(",")[index]?.trim()))
        .filter((val) => !isNaN(val));

      statistics[header] = calculateStatistics(values);
    }
  });

  // Generate recommendations based on data
  const recommendations = generateRecommendations(dataTypes, rowCount);

  return {
    summary: `CSV file with ${rowCount} rows and ${columnCount} columns. Contains ${Object.keys(dataTypes).filter((k) => dataTypes[k] === "number").length} numeric columns suitable for analysis.`,
    rowCount,
    columnCount,
    headers,
    dataTypes,
    sampleData,
    statistics,
    recommendations,
  };
}

/**
 * Analyzes JSON file content
 */
function analyzeJSON(content: any): Partial<AnalysisResult> {
  if (!content || typeof content !== "object") {
    return {
      summary: "Empty or invalid JSON file.",
      recommendations: [
        "Check the JSON format and try again",
        "Ensure the file contains valid JSON data",
      ],
    };
  }

  let rowCount = 0;
  let columnCount = 0;
  let headers: string[] = [];
  let sampleData: any[] = [];
  let dataTypes: Record<string, string> = {};

  // Handle array of objects
  if (Array.isArray(content)) {
    rowCount = content.length;
    sampleData = content.slice(0, 5);

    if (rowCount > 0 && typeof content[0] === "object") {
      headers = Object.keys(content[0]);
      columnCount = headers.length;

      // Detect data types
      headers.forEach((header) => {
        const values = content.map((item) => item[header]);
        dataTypes[header] = detectDataType(values);
      });
    }
  }
  // Handle single object
  else if (typeof content === "object") {
    headers = Object.keys(content);
    columnCount = headers.length;
    rowCount = 1;
    sampleData = [content];

    headers.forEach((header) => {
      dataTypes[header] = detectDataType([content[header]]);
    });
  }

  // Calculate statistics for numeric fields
  const statistics: Record<string, any> = {};
  headers.forEach((header) => {
    if (dataTypes[header] === "number") {
      const values = Array.isArray(content)
        ? content
            .map((item) => parseFloat(item[header]))
            .filter((val) => !isNaN(val))
        : [parseFloat(content[header])].filter((val) => !isNaN(val));

      statistics[header] = calculateStatistics(values);
    }
  });

  // Generate recommendations
  const recommendations = generateRecommendations(dataTypes, rowCount);

  return {
    summary: `JSON file with ${rowCount} records and ${columnCount} fields. Contains ${Object.keys(dataTypes).filter((k) => dataTypes[k] === "number").length} numeric fields suitable for analysis.`,
    rowCount,
    columnCount,
    headers,
    dataTypes,
    sampleData,
    statistics,
    recommendations,
  };
}

/**
 * Analyzes plain text file content
 */
function analyzeTXT(content: string): Partial<AnalysisResult> {
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.trim() !== "").length;
  const charCount = content.length;

  // Try to detect if it's a structured text file
  const isTabular = lines.every((line) => {
    const tabCount = (line.match(/\t/g) || []).length;
    return tabCount > 0 && tabCount === (lines[0].match(/\t/g) || []).length;
  });

  let summary = "";
  let recommendations: string[] = [];

  if (isTabular) {
    summary = `Text file with ${lines.length} rows that appears to be tab-delimited. Contains approximately ${wordCount} words.`;
    recommendations = [
      "Convert to CSV format for better analysis",
      "Use text classification algorithms for content analysis",
      "Consider natural language processing for text extraction",
    ];
  } else {
    summary = `Unstructured text file with ${lines.length} lines and ${wordCount} words.`;
    recommendations = [
      "Use natural language processing algorithms",
      "Consider sentiment analysis for text content",
      "Text clustering may reveal patterns in the content",
    ];
  }

  return {
    summary,
    rowCount: lines.length,
    columnCount: isTabular ? lines[0].split("\t").length : undefined,
    recommendations,
    statistics: {
      wordCount,
      charCount,
      avgWordsPerLine: wordCount / (lines.length || 1),
    },
  };
}

/**
 * Detects the data type of a column based on sample values
 */
function detectDataType(values: any[]): string {
  // Filter out empty values
  const nonEmptyValues = values.filter(
    (v) => v !== undefined && v !== null && v !== "",
  );
  if (nonEmptyValues.length === 0) return "empty";

  // Check if all values are numbers
  const allNumbers = nonEmptyValues.every(
    (v) => !isNaN(parseFloat(v)) && isFinite(v),
  );
  if (allNumbers) return "number";

  // Check if all values are dates
  const datePattern =
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/;
  const allDates = nonEmptyValues.every((v) => datePattern.test(String(v)));
  if (allDates) return "date";

  // Check if all values are booleans
  const booleanValues = ["true", "false", "0", "1", "yes", "no"];
  const allBooleans = nonEmptyValues.every((v) =>
    booleanValues.includes(String(v).toLowerCase()),
  );
  if (allBooleans) return "boolean";

  // Default to string
  return "string";
}

/**
 * Calculates basic statistics for numeric values
 */
function calculateStatistics(values: number[]): Record<string, number> {
  if (values.length === 0) return {};

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;

  // Sort values for median and percentiles
  const sortedValues = [...values].sort((a, b) => a - b);
  const median =
    sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] +
          sortedValues[sortedValues.length / 2]) /
        2
      : sortedValues[Math.floor(sortedValues.length / 2)];

  // Calculate standard deviation
  const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean,
    median,
    stdDev,
    count: values.length,
  };
}

/**
 * Generates algorithm and output recommendations based on data characteristics
 */
function generateRecommendations(
  dataTypes: Record<string, string>,
  rowCount: number,
): string[] {
  const recommendations: string[] = [];

  // Count data types
  const numericColumns = Object.values(dataTypes).filter(
    (type) => type === "number",
  ).length;
  const categoricalColumns = Object.values(dataTypes).filter(
    (type) => type === "string" || type === "boolean",
  ).length;
  const dateColumns = Object.values(dataTypes).filter(
    (type) => type === "date",
  ).length;

  // Algorithm recommendations based on data characteristics
  if (numericColumns > 0 && categoricalColumns > 0) {
    recommendations.push(
      "Random Forest algorithm is recommended for mixed numeric and categorical data",
    );
  }

  if (numericColumns > 3) {
    recommendations.push(
      "Principal Component Analysis (PCA) can help reduce dimensionality",
    );
  }

  if (categoricalColumns > numericColumns) {
    recommendations.push(
      "Decision Tree algorithm works well with categorical data",
    );
  }

  if (dateColumns > 0) {
    recommendations.push(
      "Time Series analysis is recommended for temporal data",
    );
  }

  if (rowCount > 1000) {
    recommendations.push("XGBoost algorithm performs well on large datasets");
  } else if (rowCount < 100) {
    recommendations.push(
      "K-Nearest Neighbors algorithm works well with smaller datasets",
    );
  }

  // Output format recommendations
  if (numericColumns > 3) {
    recommendations.push(
      "Graph visualization is recommended for multi-dimensional data",
    );
  } else if (numericColumns > 0) {
    recommendations.push(
      "Bar charts or line graphs are recommended for numeric data visualization",
    );
  }

  if (categoricalColumns > 0) {
    recommendations.push(
      "Pie charts are effective for categorical data distribution",
    );
  }

  return recommendations;
}
