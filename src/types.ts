/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: "Hygiene" | "Health" | "Nutrition" | "Home Care";
  description: string;
}

export interface WeatherData {
  location: string;
  condition: string;
  temp: number;
  humidity: number;
  forecastSummary: string;
}

export interface Advisory {
  immediateSupply: {
    productId: string;
    priority: "High" | "Medium" | "Low";
    reason: string;
  }[];
  manufacturingAdvice: {
    productId: string;
    action: "Increase" | "Decrease" | "Stable";
    horizon: "3 Months";
    rationale: string;
  }[];
}
