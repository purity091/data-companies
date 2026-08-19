import { catalogRepository } from "./catalog.repository";

export type CatalogResource = "countries" | "industries" | "markets";

export class CatalogService {
  list(resource: CatalogResource) {
    if (resource === "countries") return catalogRepository.listCountries();
    if (resource === "industries") return catalogRepository.listIndustries();
    return catalogRepository.listMarkets();
  }
}

export const catalogService = new CatalogService();
