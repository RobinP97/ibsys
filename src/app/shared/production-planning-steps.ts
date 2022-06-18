import { Step } from '../model/production/step';

export const STEPS: Step[] = [
  { title: 'import.title', index: 0, path: '' },
  { title: 'forecast.title', index: 1, path: 'forecast' },
  { title: 'directSales.title', index: 2, path: 'directsales' },
  { title: 'production.title', index: 3, path: 'production' },
  { title: 'sequencePlanning.title', index: 4, path: 'sequencePlanning' },
  { title: 'orderPlanning.title', index: 5, path: 'orderPlanning' },
  { title: 'orderPriceOverview.title', index: 6, path: 'orderPriceOverview' },
  { title: 'capacity.title', index: 7, path: 'capacity' },
  { title: 'export.title', index: 8, path: 'export' },
];
