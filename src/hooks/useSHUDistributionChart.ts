
/**
 * Interface for SHU distribution data
 */
export interface SHUData {
  id: string;
  name: string;
  shu: number;
}

/**
 * Interface for chart-ready SHU data point
 */
export interface ChartSHUData {
  name: string;
  value: number;
}

/**
 * Custom hook for preparing and formatting SHU distribution data for charts
 */
export function useSHUDistributionChart() {
  /**
   * Prepares SHU data for pie chart visualization
   * @param data Raw SHU distribution data
   * @returns Formatted data for the pie chart
   */
  const prepareSHUChartData = (data: SHUData[]): ChartSHUData[] => {
    return data.map(item => ({
      name: item.name,
      value: item.shu
    }));
  };

  /**
   * Get color palette for SHU chart segments
   * @returns Array of color hex codes
   */
  const getSHUChartColors = (): string[] => {
    return [
      '#8884d8', '#82ca9d', '#ffc658', '#ff8042', 
      '#0088fe', '#00C49F', '#FFBB28', '#FF8042'
    ];
  };

  return {
    prepareSHUChartData,
    getSHUChartColors
  };
}
