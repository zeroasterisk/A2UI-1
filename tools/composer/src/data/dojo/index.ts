// Real v0.8 scenarios from samples/agent/adk/ — verified working with the renderer
import restaurantBooking from './restaurant-booking.json';
import restaurantList from './restaurant-list.json';
import restaurantGrid from './restaurant-grid.json';
import restaurantConfirmation from './restaurant-confirmation.json';
import restaurantFinder from './restaurant-finder.json';
import bookingForm from './booking-form.json';
import contactCard from './contact-card.json';
import contactList from './contact-list.json';
import contactLookup from './contact-lookup.json';
import orgChart from './org-chart.json';
import floorPlan from './floor-plan.json';
import rizzchartsChart from './rizzcharts-chart.json';
import multiSurface from './multi-surface.json';
import chartNodeClick from './chart-node-click.json';
import rizzchartsCatalogChart from './rizzcharts-catalog-chart.json';
import rizzchartsCatalogMap from './rizzcharts-catalog-map.json';
import standardCatalogMap from './standard-catalog-map.json';

export const scenarios = {
  'restaurant-booking': restaurantBooking,
  'restaurant-list': restaurantList,
  'restaurant-grid': restaurantGrid,
  'restaurant-confirmation': restaurantConfirmation,
  'restaurant-finder': restaurantFinder,
  'booking-form': bookingForm,
  'contact-card': contactCard,
  'contact-list': contactList,
  'contact-lookup': contactLookup,
  'org-chart': orgChart,
  'floor-plan': floorPlan,
  'rizzcharts-chart': rizzchartsChart,
  'multi-surface': multiSurface,
  'chart-node-click': chartNodeClick,
  'rizzcharts-catalog-chart': rizzchartsCatalogChart,
  'rizzcharts-catalog-map': rizzchartsCatalogMap,
  'standard-catalog-map': standardCatalogMap,
};

export type ScenarioId = keyof typeof scenarios;
