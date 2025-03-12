import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
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
import {
  Info,
  BarChart,
  Brain,
  Database,
  LineChart,
  PieChart,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlgorithmProps {
  id: string;
  name: string;
  description: string;
  category: string;
  useCases: string[];
  complexity: "Low" | "Medium" | "High";
  icon: React.ReactNode;
}

interface AlgorithmSelectionPanelProps {
  algorithms?: AlgorithmProps[];
  onSelect?: (algorithm: AlgorithmProps) => void;
  selectedAlgorithm?: string;
}

const defaultAlgorithms: AlgorithmProps[] = [
  {
    id: "linear-regression",
    name: "Linear Regression",
    description:
      "Predicts a continuous value based on independent variables by fitting a linear equation.",
    category: "Regression",
    useCases: ["Price prediction", "Sales forecasting", "Trend analysis"],
    complexity: "Low",
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    id: "decision-tree",
    name: "Decision Tree",
    description:
      "Creates a tree-like model of decisions based on multiple conditions and their possible outcomes.",
    category: "Classification",
    useCases: ["Customer segmentation", "Risk assessment", "Medical diagnosis"],
    complexity: "Medium",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "k-means",
    name: "K-Means Clustering",
    description:
      "Groups data points into k clusters based on feature similarity.",
    category: "Clustering",
    useCases: ["Market segmentation", "Image compression", "Anomaly detection"],
    complexity: "Medium",
    icon: <PieChart className="h-5 w-5" />,
  },
  {
    id: "neural-network",
    name: "Neural Network",
    description:
      "Deep learning model inspired by the human brain, capable of learning complex patterns.",
    category: "Deep Learning",
    useCases: [
      "Image recognition",
      "Natural language processing",
      "Time series prediction",
    ],
    complexity: "High",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "random-forest",
    name: "Random Forest",
    description:
      "Ensemble learning method that constructs multiple decision trees and outputs the average prediction.",
    category: "Classification",
    useCases: [
      "Fraud detection",
      "Feature selection",
      "Recommendation systems",
    ],
    complexity: "Medium",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "xgboost",
    name: "XGBoost",
    description:
      "Gradient boosting algorithm known for its performance and speed.",
    category: "Regression",
    useCases: ["Competition modeling", "Credit scoring", "Ad click prediction"],
    complexity: "High",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "time-series",
    name: "ARIMA",
    description:
      "Time series forecasting model that captures temporal dependencies in data.",
    category: "Time Series",
    useCases: [
      "Stock price prediction",
      "Weather forecasting",
      "Demand planning",
    ],
    complexity: "Medium",
    icon: <BarChart className="h-5 w-5" />,
  },
];

const AlgorithmSelectionPanel: React.FC<AlgorithmSelectionPanelProps> = ({
  algorithms = defaultAlgorithms,
  onSelect = () => {},
  selectedAlgorithm = "",
}) => {
  // Group algorithms by category
  const categories = [...new Set(algorithms.map((algo) => algo.category))];

  // State to track the currently selected algorithm for detailed view
  const [detailedView, setDetailedView] = React.useState<string | null>(null);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Algorithm Selection</h2>
        <p className="text-muted-foreground">
          Choose the best algorithm for your data analysis needs
        </p>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="mb-4 bg-muted/50 p-1 w-full flex overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-shrink-0"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {algorithms
                .filter((algo) => algo.category === category)
                .map((algorithm) => (
                  <Card
                    key={algorithm.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedAlgorithm === algorithm.id
                        ? "ring-2 ring-primary"
                        : "",
                    )}
                    onClick={() => {
                      onSelect(algorithm);
                      setDetailedView(algorithm.id);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-primary/10 text-primary">
                            {algorithm.icon}
                          </div>
                          <CardTitle className="text-lg">
                            {algorithm.name}
                          </CardTitle>
                        </div>
                        <Badge
                          className={cn(
                            "ml-2",
                            getComplexityColor(algorithm.complexity),
                          )}
                        >
                          {algorithm.complexity} Complexity
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        {algorithm.description}
                      </CardDescription>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {algorithm.useCases.map((useCase, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailedView(
                            algorithm.id === detailedView ? null : algorithm.id,
                          );
                        }}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        {algorithm.id === detailedView
                          ? "Hide Details"
                          : "View Details"}
                      </Button>
                    </CardFooter>
                    {algorithm.id === detailedView && (
                      <div className="px-6 pb-4 pt-0">
                        <div className="p-3 bg-muted/30 rounded-md text-sm">
                          <h4 className="font-medium mb-1">
                            Recommended Use Cases:
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {algorithm.useCases.map((useCase, index) => (
                              <li key={index}>{useCase}</li>
                            ))}
                          </ul>
                          <h4 className="font-medium mt-3 mb-1">
                            Technical Details:
                          </h4>
                          <p className="text-muted-foreground">
                            {algorithm.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AlgorithmSelectionPanel;
