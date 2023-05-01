import {
  ArticleInfoDetailGroupInterface,
  DetailGroupEnum,
  ArticleInfoRowInterface,
  ArticleInfoDetailInterface,
  ArticleInfoIDEnum,
  ArticleInfoTextEnum,
  ArticleInfoNameEnum,
  DetailGroupDisplayNameEnum,
} from '@app/nshift-types';
import { tenant } from '@app/skipum';
import { Logger } from '@nestjs/common';
import { Item as ShipexecItem } from '@app/shipexec';

class ArticleInfofMapper {
  static readonly logger = new Logger(ArticleInfofMapper.name);
  static getAll(shipment: tenant.Shipment): ArticleInfoDetailGroupInterface {
    const detailGroup = {} as ArticleInfoDetailGroupInterface;
    detailGroup.GroupID = DetailGroupEnum.ArticleInfo;
    detailGroup.GroupDisplayName = DetailGroupDisplayNameEnum.ArticleInfo;
    detailGroup.Rows = [] as ArticleInfoRowInterface[];

    /*
    let shipmentExtras = [] as ShipexecItem[];
    try {
      shipmentExtras = shipment.packageExtras.Item;
    } catch (error) {
      this.logger.warn(`Shipment Extras not available`);
    }
    */

    shipment.toShipUnits.forEach((shipunit: tenant.ShipUnit, index) => {
      const articleInfoRow = {} as ArticleInfoRowInterface;
      articleInfoRow.LineNo = index + 1;
      articleInfoRow.Details = [] as ArticleInfoDetailInterface[];

      // const contentIndex0 = shipunit.toContents[0] as tenant.ShipUnitContent;

      let packageExtras = [] as ShipexecItem[];
      try {
        packageExtras = shipunit.packageExtras.Item;
      } catch (error) {
        this.logger.warn(`Shipunit Package Extras not available`);
      }

      try {
        const articleNo = {
          KindID: ArticleInfoIDEnum.ArticleNo,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ArticleNo)?.Value,
          DisplayName: ArticleInfoTextEnum.ArticleNo,
        } as ArticleInfoDetailInterface;
        if (articleNo.Value) {
          articleInfoRow.Details.push(articleNo);
          this.logger.log(`Detail Kind ArticleNo set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ArticleNo ${index + 1}`);
      }

      try {
        const unitValue = {
          KindID: ArticleInfoIDEnum.UnitValue,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.UnitValue)?.Value,
          DisplayName: ArticleInfoTextEnum.UnitValue,
        } as ArticleInfoDetailInterface;
        if (unitValue.Value) {
          articleInfoRow.Details.push(unitValue);
          this.logger.log(`Detail Kind UnitValue set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind UnitValue ${index + 1}`);
      }

      try {
        // Tariff Code #3
        // TODO: confirmation needed this field maps to harmonized code
        const tariffCode = {
          KindID: ArticleInfoIDEnum.TariffCode,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.TariffCode)?.Value,
          DisplayName: ArticleInfoTextEnum.TariffCode,
        } as ArticleInfoDetailInterface;
        if (tariffCode.Value) {
          articleInfoRow.Details.push(tariffCode);
          this.logger.log(`Detail Kind TariffCode set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind TariffCode ${index + 1}`);
      }

      try {
        // CountryOfOrigin #4
        const countryOfOrigin = {
          KindID: ArticleInfoIDEnum.CountryOfOrigin,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.CountryOfOrigin)?.Value,
          DisplayName: ArticleInfoTextEnum.CountryOfOrigin,
        } as ArticleInfoDetailInterface;
        if (countryOfOrigin.Value) {
          articleInfoRow.Details.push(countryOfOrigin);
          this.logger.log(`Detail Kind CountryOfOrigin set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind CountryOfOrigin ${index + 1}`);
      }

      try {
        // Quantity #5
        const quantity = {
          KindID: ArticleInfoIDEnum.Quantity,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.Quantity)?.Value,
          DisplayName: ArticleInfoTextEnum.Quantity,
        } as ArticleInfoDetailInterface;
        if (quantity.Value) {
          articleInfoRow.Details.push(quantity);
          this.logger.log(`Detail Kind Quantity set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind Quantity ${index + 1}`);
      }

      try {
        // UnitWeight Enum Value 6
        const unitWeight = {
          KindID: ArticleInfoIDEnum.UnitWeight,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.UnitWeight)?.Value,
          DisplayName: ArticleInfoTextEnum.UnitWeight,
        } as ArticleInfoDetailInterface;
        if (unitWeight.Value) {
          articleInfoRow.Details.push(unitWeight);
          this.logger.log(`Detail Kind UnitWeight set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind UnitWeight ${index + 1}`);
      }

      try {
        // Description of Goods Enum Value 7
        const descriptionOfGoods = {
          KindID: ArticleInfoIDEnum.DescrOfGoods,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.DescrOfGoods)?.Value,
          DisplayName: ArticleInfoTextEnum.DescrOfGoods,
        } as ArticleInfoDetailInterface;
        if (descriptionOfGoods.Value) {
          articleInfoRow.Details.push(descriptionOfGoods);
          this.logger.log(`Detail Kind DescrOfGoods set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind DescrOfGoods ${index + 1}`);
      }

      try {
        // Unit of Measure (Enum val 8)
        const unitOfMeasure = {
          KindID: ArticleInfoIDEnum.UnitOfMeasure,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.UnitOfMeasure)?.Value,
          DisplayName: ArticleInfoTextEnum.UnitOfMeasure,
        } as ArticleInfoDetailInterface;
        if (unitOfMeasure.Value) {
          articleInfoRow.Details.push(unitOfMeasure);
          this.logger.log(`Detail Kind UnitOfMeasure set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind UnitOfMeasure ${index + 1}`);
      }

      try {
        // Total Weight (Enum val 9)
        const totalWeight = {
          KindID: ArticleInfoIDEnum.TotalWeight,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.TotalWeight)?.Value,
          DisplayName: ArticleInfoTextEnum.TotalWeight,
        } as ArticleInfoDetailInterface;
        if (totalWeight.Value) {
          articleInfoRow.Details.push(totalWeight);
          this.logger.log(`Detail Kind TotalWeight set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind TotalWeight ${index + 1}`);
      }

      try {
        // Total value (enum val 10)
        const totalValue = {
          KindID: ArticleInfoIDEnum.TotalValue,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.TotalValue)?.Value,
          DisplayName: ArticleInfoTextEnum.TotalValue,
        } as ArticleInfoDetailInterface;
        if (totalValue.Value) {
          articleInfoRow.Details.push(totalValue);
          this.logger.log(`Detail Kind TotalValue set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind TotalValue ${index + 1}`);
      }

      try {
        // Customs value enum val 16
        const customsValue = {
          KindID: ArticleInfoIDEnum.CustomsValue,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.CustomsValue)?.Value,
          DisplayName: ArticleInfoTextEnum.CustomsValue,
        } as ArticleInfoDetailInterface;
        if (customsValue.Value) {
          articleInfoRow.Details.push(customsValue);
          this.logger.log(`Detail Kind CustomsValue set by Package Extras ${index + 1}`);
        } else {
          customsValue.Value = JSON.stringify(shipunit.declaredValueCustoms_value);
          if (customsValue.Value) {
            articleInfoRow.Details.push(customsValue);
            this.logger.log(`Detail Kind CustomsValue set direct mapping ${index + 1}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind CustomsValue ${index + 1}`);
      }

      try {
        // Customs Article Currency enum val 17
        const customsCurrency = {
          KindID: ArticleInfoIDEnum.CustomsArticleCurrency,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.CustomsArticleCurrency)?.Value,
          DisplayName: ArticleInfoTextEnum.CustomsArticleCurrency,
        } as ArticleInfoDetailInterface;
        if (customsCurrency.Value) {
          articleInfoRow.Details.push(customsCurrency);
          this.logger.log(`Detail Kind CustomsArticleCurrency set by Package Extras ${index + 1}`);
        } else {
          customsCurrency.Value = shipunit.declaredValueCustoms_currency;
          if (customsCurrency.Value) {
            articleInfoRow.Details.push(customsCurrency);
            this.logger.log(`Detail Kind CustomsArticleCurrency set direct mapping ${index + 1}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind CustomsArticleCurrency ${index + 1}`);
      }

      try {
        // Customs Article Commodity Code enum val 18
        //TODO: is it okay to use content index 0 for commodity code?
        const customsCommodityCode = {
          KindID: ArticleInfoIDEnum.CustomsArticleCommodityCode,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.CustomsArticleCommodityCode)?.Value,
          DisplayName: ArticleInfoTextEnum.CustomsArticleCommodityCode,
        } as ArticleInfoDetailInterface;
        if (customsCommodityCode.Value) {
          articleInfoRow.Details.push(customsCommodityCode);
          this.logger.log(`Detail Kind CustomsArticleCommodityCode set by Package Extras ${index + 1}`);
        } else {
          customsCommodityCode.Value = contentIndex0.ShipmentContent.harmonizedCode;
          if (customsCommodityCode.Value) {
            articleInfoRow.Details.push(customsCommodityCode);
            this.logger.log(`Detail Kind CustomsArticleCommodityCode set direct mapping ${index + 1}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind CustomsArticleCommodityCode ${index + 1}`);
      }

      try {
        // Number of pieces (Enum val 32)
        const numberOfPieces = {
          KindID: ArticleInfoIDEnum.NumberOfPieces,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.NumberOfPieces)?.Value,
          DisplayName: ArticleInfoTextEnum.NumberOfPieces,
        } as ArticleInfoDetailInterface;
        if (numberOfPieces.Value) {
          articleInfoRow.Details.push(numberOfPieces);
          this.logger.log(`Detail Kind NumberOfPieces set by Package Extras ${index + 1}`);
        } else {
          numberOfPieces.Value = shipunit.toContents.length.toString();
          if (numberOfPieces.Value) {
            articleInfoRow.Details.push(numberOfPieces);
            this.logger.log(`Detail Kind NumberOfPieces set direct mapping ${index + 1}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error getting number of pieces for line ${index + 1}`);
      }

      try {
        // Netto weight (Enum val 36)
        const nettoWeight = {
          KindID: ArticleInfoIDEnum.NettoWeight,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.NettoWeight)?.Value,
          DisplayName: ArticleInfoTextEnum.NettoWeight,
        } as ArticleInfoDetailInterface;
        if (nettoWeight.Value) {
          articleInfoRow.Details.push(nettoWeight);
          this.logger.log(`Detail Kind NettoWeight set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind NettoWeight ${index + 1}`);
      }

      try {
        // Number of Items Enum 180
        const numberOfItems = {
          KindID: ArticleInfoIDEnum.NumberOfItems,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.NumberOfItems)?.Value,
          DisplayName: ArticleInfoTextEnum.NumberOfItems,
        } as ArticleInfoDetailInterface;
        if (numberOfItems.Value) {
          articleInfoRow.Details.push(numberOfItems);
          this.logger.log(`Detail Kind NumberOfItems set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind NumberOfItems ${index + 1}`);
      }

      try {
        // Product Description Enum 184
        const productDescription = {
          KindID: ArticleInfoIDEnum.ProductDescription,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProductDescription)?.Value,
          DisplayName: ArticleInfoTextEnum.ProductDescription,
        } as ArticleInfoDetailInterface;
        if (productDescription.Value) {
          articleInfoRow.Details.push(productDescription);
          this.logger.log(`Detail Kind ProductDescription set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProductDescription ${index + 1}`);
      }

      try {
        // Product Composition Enum 185
        const productComposition = {
          KindID: ArticleInfoIDEnum.ProductComposition,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProductComposition)?.Value,
          DisplayName: ArticleInfoTextEnum.ProductComposition,
        } as ArticleInfoDetailInterface;
        if (productComposition.Value) {
          articleInfoRow.Details.push(productComposition);
          this.logger.log(`Detail Kind ProductComposition set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProductComposition ${index + 1}`);
      }

      try {
        // Product Code Enum 186
        const productCode = {
          KindID: ArticleInfoIDEnum.ProductCode,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProductCode)?.Value,
          DisplayName: ArticleInfoTextEnum.ProductCode,
        } as ArticleInfoDetailInterface;
        if (productCode.Value) {
          articleInfoRow.Details.push(productCode);
          this.logger.log(`Detail Kind ProductCode set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProductCode ${index + 1}`);
      }

      try {
        // Product Size Enum 187
        const productSize = {
          KindID: ArticleInfoIDEnum.ProductSize,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProductSize)?.Value,
          DisplayName: ArticleInfoTextEnum.ProductSize,
        } as ArticleInfoDetailInterface;
        if (productSize.Value) {
          articleInfoRow.Details.push(productSize);
          this.logger.log(`Detail Kind ProductSize set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProductSize ${index + 1}`);
      }

      try {
        // Preference Enum 188
        const preference = {
          KindID: ArticleInfoIDEnum.Preference,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.Preference)?.Value,
          DisplayName: ArticleInfoTextEnum.Preference,
        } as ArticleInfoDetailInterface;
        if (preference.Value) {
          articleInfoRow.Details.push(preference);
          this.logger.log(`Detail Kind Preference set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind Preference ${index + 1}`);
      }

      try {
        // Procedure Code Enum 189
        const procedureCode = {
          KindID: ArticleInfoIDEnum.ProcedureCode,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProcedureCode)?.Value,
          DisplayName: ArticleInfoTextEnum.ProcedureCode,
        } as ArticleInfoDetailInterface;
        if (procedureCode.Value) {
          articleInfoRow.Details.push(procedureCode);
          this.logger.log(`Detail Kind ProcedureCode set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProcedureCode ${index + 1}`);
      }

      try {
        // Supplementary Unit Enum 190
        const supplementaryUnit = {
          KindID: ArticleInfoIDEnum.SupplementaryUnit,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.SupplementaryUnit)?.Value,
          DisplayName: ArticleInfoTextEnum.SupplementaryUnit,
        } as ArticleInfoDetailInterface;
        if (supplementaryUnit.Value) {
          articleInfoRow.Details.push(supplementaryUnit);
          this.logger.log(`Detail Kind SupplementaryUnit set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind SupplementaryUnit ${index + 1}`);
      }

      try {
        // Certificates Code Enum 191
        const certificatesCode = {
          KindID: ArticleInfoIDEnum.CertificatesCode,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.CertificatesCode)?.Value,
          DisplayName: ArticleInfoTextEnum.CertificatesCode,
        } as ArticleInfoDetailInterface;
        if (certificatesCode.Value) {
          articleInfoRow.Details.push(certificatesCode);
          this.logger.log(`Detail Kind CertificatesCode set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind CertificatesCode ${index + 1}`);
      }

      try {
        // Certificates Enum 192
        const certificates = {
          KindID: ArticleInfoIDEnum.Certificates,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.Certificates)?.Value,
          DisplayName: ArticleInfoTextEnum.Certificates,
        } as ArticleInfoDetailInterface;
        if (certificates.Value) {
          articleInfoRow.Details.push(certificates);
          this.logger.log(`Detail Kind Certificates set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind Certificates ${index + 1}`);
      }

      try {
        // Goods Line Number Enum 193
        const goodsLineNumber = {
          KindID: ArticleInfoIDEnum.GoodsLineNo,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.GoodsLineNo)?.Value,
          DisplayName: ArticleInfoTextEnum.GoodsLineNo,
        } as ArticleInfoDetailInterface;
        if (goodsLineNumber.Value) {
          articleInfoRow.Details.push(goodsLineNumber);
          this.logger.log(`Detail Kind GoodsLineNo set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind GoodsLineNo ${index + 1}`);
      }

      try {
        // Unit Volume Enum 505
        const unitVolume = {
          KindID: ArticleInfoIDEnum.UnitVolume,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.UnitVolume)?.Value,
          DisplayName: ArticleInfoTextEnum.UnitVolume,
        } as ArticleInfoDetailInterface;
        if (unitVolume.Value) {
          articleInfoRow.Details.push(unitVolume);
          this.logger.log(`Detail Kind UnitVolume set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind UnitVolume ${index + 1}`);
      }

      try {
        // Gender Enum 506
        const gender = {
          KindID: ArticleInfoIDEnum.Gender,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.Gender)?.Value,
          DisplayName: ArticleInfoTextEnum.Gender,
        } as ArticleInfoDetailInterface;
        if (gender.Value) {
          articleInfoRow.Details.push(gender);
          this.logger.log(`Detail Kind Gender set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind Gender ${index + 1}`);
      }

      try {
        // Construction Enum 507
        const construction = {
          KindID: ArticleInfoIDEnum.Construction,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.Construction)?.Value,
          DisplayName: ArticleInfoTextEnum.Construction,
        } as ArticleInfoDetailInterface;
        if (construction.Value) {
          articleInfoRow.Details.push(construction);
          this.logger.log(`Detail Kind Construction set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind Construction ${index + 1}`);
      }

      try {
        // Fabric Marked Enum 508
        const fabricMarked = {
          KindID: ArticleInfoIDEnum.FabricMarked,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.FabricMarked)?.Value,
          DisplayName: ArticleInfoTextEnum.FabricMarked,
        } as ArticleInfoDetailInterface;
        if (fabricMarked.Value) {
          articleInfoRow.Details.push(fabricMarked);
          this.logger.log(`Detail Kind FabricMarked set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind FabricMarked ${index + 1}`);
      }

      try {
        // Fabric Mutilated Enum 509
        const fabricMutilated = {
          KindID: ArticleInfoIDEnum.FabricMutilated,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.FabricMutilated)?.Value,
          DisplayName: ArticleInfoTextEnum.FabricMutilated,
        } as ArticleInfoDetailInterface;
        if (fabricMutilated.Value) {
          articleInfoRow.Details.push(fabricMutilated);
          this.logger.log(`Detail Kind FabricMutilated set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind FabricMutilated ${index + 1}`);
      }

      try {
        // Manufacturer Enum 510
        const manufacturer = {
          KindID: ArticleInfoIDEnum.Manufacturer,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.Manufacturer)?.Value,
          DisplayName: ArticleInfoTextEnum.Manufacturer,
        } as ArticleInfoDetailInterface;
        if (manufacturer.Value) {
          articleInfoRow.Details.push(manufacturer);
          this.logger.log(`Detail Kind Manufacturer set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind Manufacturer ${index + 1}`);
      }

      try {
        // Production Address Enum 511
        const productionAddress = {
          KindID: ArticleInfoIDEnum.ProductionAddress,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProductionAddress)?.Value,
          DisplayName: ArticleInfoTextEnum.ProductionAddress,
        } as ArticleInfoDetailInterface;
        if (productionAddress.Value) {
          articleInfoRow.Details.push(productionAddress);
          this.logger.log(`Detail Kind ProductionAddress set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProductionAddress ${index + 1}`);
      }

      try {
        // Production Postal Code Enum 512
        const productionPostalCode = {
          KindID: ArticleInfoIDEnum.ProductionPostalCode,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProductionPostalCode)?.Value,
          DisplayName: ArticleInfoTextEnum.ProductionPostalCode,
        } as ArticleInfoDetailInterface;
        if (productionPostalCode.Value) {
          articleInfoRow.Details.push(productionPostalCode);
          this.logger.log(`Detail Kind ProductionPostalCode set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProductionPostalCode ${index + 1}`);
      }

      try {
        // Production City Enum 513
        const productionCity = {
          KindID: ArticleInfoIDEnum.ProductionCity,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.ProductionCity)?.Value,
          DisplayName: ArticleInfoTextEnum.ProductionCity,
        } as ArticleInfoDetailInterface;
        if (productionCity.Value) {
          articleInfoRow.Details.push(productionCity);
          this.logger.log(`Detail Kind ProductionCity set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind ProductionCity ${index + 1}`);
      }

      try {
        // Purchase URL enum 516
        const purchaseURL = {
          KindID: ArticleInfoIDEnum.PurchaseURL,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.PurchaseURL)?.Value,
          DisplayName: ArticleInfoTextEnum.PurchaseURL,
        } as ArticleInfoDetailInterface;
        if (purchaseURL.Value) {
          articleInfoRow.Details.push(purchaseURL);
          this.logger.log(`Detail Kind PurchaseURL set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind PurchaseURL ${index + 1}`);
      }

      try {
        // WeightUOM Enum 517
        const weightUOM = {
          KindID: ArticleInfoIDEnum.WeightUOM,
          Value: packageExtras.find((obj) => obj.Key === ArticleInfoNameEnum.WeightUOM)?.Value,
          DisplayName: ArticleInfoTextEnum.WeightUOM,
        } as ArticleInfoDetailInterface;
        if (weightUOM.Value) {
          articleInfoRow.Details.push(weightUOM);
          this.logger.log(`Detail Kind WeightUOM set by Package Extras ${index + 1}`);
        } else {
          // Direct mapping logic here...
        }
      } catch (error) {
        this.logger.error(`Error setting Detail Kind WeightUOM ${index + 1}`);
      }

      detailGroup.Rows.push(articleInfoRow);
    });
    return detailGroup;
  }
}

export { ArticleInfofMapper };
