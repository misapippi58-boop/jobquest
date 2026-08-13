// industryData.ts
import { medicalIndustryData } from './medical';
import { itAiIndustryData } from './it-ai';
import { makerIndustryData } from './maker';
import { shoshaIndustryData } from './shosha';
import { financeIndustryData } from './finance';
import { consultingIndustryData } from './consulting';
import { marketingIndustryData } from './marketing';
import { mediaIndustryData } from './media';
import { retailIndustryData } from './retail';
import { realEstateConstructionIndustryData } from './realEstateConstruction';
import { infrastructureEnergyIndustryData } from './infrastructureEnergy';
import { telecommunicationIndustryData } from './telecommunication';
import { logisticsTransportationIndustryData } from './logisticsTransportation';
import { travelHotelIndustryData } from './travelHotel';
import { foodBeverageIndustryData } from './foodBeverage';
import { beautyFashionIndustryData } from './beautyFashion';
import { educationHrIndustryData } from './educationHr';
import { publicSectorIndustryData } from './publicSector';
import { agricultureIndustryData } from './agriculture';

export const combinedIndustryData: Record<string, any> = {
  ...medicalIndustryData,
  ...itAiIndustryData,
  ...makerIndustryData,
  ...shoshaIndustryData,
  ...financeIndustryData,
  ...consultingIndustryData,
  ...marketingIndustryData,
  ...mediaIndustryData,
  ...retailIndustryData,
  ...realEstateConstructionIndustryData,
  ...infrastructureEnergyIndustryData,
  ...telecommunicationIndustryData,
  ...logisticsTransportationIndustryData,
  ...travelHotelIndustryData,
  ...foodBeverageIndustryData,
  ...beautyFashionIndustryData,
  ...educationHrIndustryData,
  ...publicSectorIndustryData,
  ...agricultureIndustryData,
};