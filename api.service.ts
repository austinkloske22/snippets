import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ADAPTER_SERVICE,
  AUTH_SERVICE,
  CreateTenantDto,
  CreateTenantRpcDto,
  TENANCY_SERVICE,
  tenancyMessages,
  adapterMessages,
  DeleteTenantRpcDto,
  nshiftMessages,
  NSHIFT_SERVICE,
  BaseRpc,
  SubmitShipmentRpc,
  CarrierServiceMappingsInterface,
  ErrorTypeEnum,
  GoodsTypeSelctionRpc,
  ProductDeterminationRpc,
  ShipperEntity,
  AddressEntityInterface,
} from '@app/common';
import { Observable, lastValueFrom } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import { SkipumService, AddressTypeEnum, ShipmentRpcDto, tenant } from '@app/skipum';
import { NShiftException } from '@app/nshift-types';
import { ShipRequestRpcDto } from '@app/shipexec';
import { v4 as uuidv4 } from 'uuid';

const logger = new Logger('ApiService');

@Injectable()
export class ApiService {
  constructor(
    @Inject(ADAPTER_SERVICE) private adapterClient: ClientProxy,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(TENANCY_SERVICE) private tenancyClient: ClientProxy,
    @Inject(NSHIFT_SERVICE) private nshiftClient: ClientProxy,
  ) {}

  getBaseRpcMessage(req: ExpressRequest): BaseRpc {
    const actorId = req.user?.ActorId;
    const tenantId = req.user?.TenantId;
    const message = {
      Authentication: req.cookies?.Authentication || req.headers.authorization,
      ActorId: actorId,
      TenantId: JSON.stringify(tenantId),
    } as BaseRpc;
    return message;
  }

  healthCheck(): string {
    return 'Healthy';
  }

  /*
  testAuth(): Observable<any> {
    const payload = { message: 'test auth communication', data: 'test auth communication' };
    return this.authClient.send('test_auth', JSON.stringify(payload));
  }
  */
  /*******************************************
   * General Methods
   ******************************************/
  getPartner(addressType: AddressTypeEnum, address: AddressEntityInterface): tenant.ShipmentPartner {
    const myPartner = {} as tenant.ShipmentPartner;
    if (address) {
      myPartner.ID = uuidv4();
      myPartner.AddressType_code = addressType;
      myPartner.addressee = address.addressee;
      myPartner.address1 = address.address1;
      myPartner.address2 = address.address2;
      myPartner.city = address.city;
      myPartner.region = address.region;
      myPartner.postalCode = address.postalCode;
      myPartner.country = address.country;
      myPartner.communicationMethod_mobilePhone = address.mobilePhone || address.businessPhone;
      myPartner.communicationMethod_email = address.email;
      //myPartner.contact = address.contact;
      //myPartner.fax = address.fax;
      //myPartner.shipperID = address.shipperID;
      //myPartner.shipperAccount = address.shipperAccount;
    }
    return myPartner;
    /*
    myPartner.ID = uuidv4();
    myPartner.address1 = address.Address1;
    myPartner.address2 = address.Address2;
    myPartner.address3 = address.Address3;
    myPartner.city = address.City;
    myPartner.addressee = address.Contact;
    myPartner.country = address.Country;
    myPartner.region = address.StateProvince;
    myPartner.postalCode = address.PostalCode;
    myPartner.company = address.Company;
    myPartner.account = address.Account;
    myPartner.AddressType_code = undefined;
    // Phone Numbers
    myPartner.communicationMethod_businessPhone = address.Phone;
    myPartner.communicationMethod_mobilePhone = address.Phone;
    */
  }
  productDetermination(shipment: tenant.Shipment, carrierServiceMappings: CarrierServiceMappingsInterface[]): number {
    if (carrierServiceMappings.length < 1) {
      throw new HttpException('No Carrier Service Mappings Found', HttpStatus.NOT_ACCEPTABLE);
    }

    const skipumService = new SkipumService();
    const shipTo = skipumService.findPartner(shipment.toPartners, AddressTypeEnum.ShipTo) as tenant.ShipmentPartner;
    const shipFrom = skipumService.findPartner(shipment.toPartners, AddressTypeEnum.ShipFrom) as tenant.ShipmentPartner;

    // Match Origin and Destination Countrys
    let myCarrierServiceMapping = carrierServiceMappings.find(
      (carrierServiceMapping: CarrierServiceMappingsInterface) => {
        return (
          carrierServiceMapping.originCountryID === shipFrom.country &&
          carrierServiceMapping.destinationCountryID === shipTo.country
        );
      },
    );

    // Match Origin Country Only
    if (!myCarrierServiceMapping) {
      myCarrierServiceMapping = carrierServiceMappings.find(
        (carrierServiceMapping: CarrierServiceMappingsInterface) => {
          return (
            carrierServiceMapping.originCountryID === shipFrom.country &&
            carrierServiceMapping.destinationCountryID === '*'
          );
        },
      );
    }
    // Match first entry
    if (!myCarrierServiceMapping) {
      myCarrierServiceMapping = carrierServiceMappings[0];
    }
    return myCarrierServiceMapping.ProdConceptID;
  }

  /*******************************************
   * Ping Tests
   ******************************************/
  pingAdapterConnection(message: BaseRpc): Observable<any> {
    return this.adapterClient.send(adapterMessages.ping, message);
  }
  pingTenancyConnection(message: BaseRpc): Observable<any> {
    return this.tenancyClient.send(tenancyMessages.ping, message);
  }
  pingNShiftConnection(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.ping, message);
  }
  async handleNShiftError(message: BaseRpc): Promise<any> {
    const response = await lastValueFrom(this.nshiftClient.send(nshiftMessages.handle_error, message));
    if (response.ErrorType === ErrorTypeEnum.NShiftValidation) {
      const error = response as NShiftException;
      throw new NShiftException(ErrorTypeEnum.NShiftValidation, error.Message, error.Errors);
    } else {
      logger.log('NShift Exception not caught', response);
      return response;
    }
  }
  /*******************************************
   * NShift Communication
   ******************************************/
  findNShiftProductDetermination(message: ProductDeterminationRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.find_product, message);
  }
  getNShiftCustomerPackaging(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_customer_packaging, message);
  }
  getNShiftGoodsTypeByPackaging(message: GoodsTypeSelctionRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_goods_type_by_packaging, message);
  }
  getNShiftGoodsTypes(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_goods_types, message);
  }
  getNShiftProductDeterminations(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.all_product_determinations, message);
  }
  /*
  mapSubmitShipment(message: SubmitShipmentRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.map_submit_shipment, message);
  }
  */
  getNShiftProfile(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_profile, message);
  }
  getNShiftCarriers(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_carriers, message);
  }
  getNShiftSubcarriers(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_subcarriers, message);
  }
  getNShiftProducts(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_products, message);
  }
  getNShiftDetailGroups(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_detail_groups, message);
  }
  getNShiftDetails(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_details, message);
  }
  getNShiftServices(message: BaseRpc): Observable<any> {
    return this.nshiftClient.send(nshiftMessages.get_services, message);
  }
  async mapNShiftShipment(message: SubmitShipmentRpc): Promise<any> {
    const response = await lastValueFrom(this.nshiftClient.send(nshiftMessages.map_shipment, message));
    if (response.ErrorType === ErrorTypeEnum.NShiftValidation) {
      const error = response as NShiftException;
      throw new NShiftException(ErrorTypeEnum.NShiftValidation, error.message, error.Errors);
    } else {
      return response;
    }
  }
  async submitNShiftShipment(message: SubmitShipmentRpc): Promise<tenant.Shipment> {
    const response = await lastValueFrom(this.nshiftClient.send(nshiftMessages.submit_shipment, message));
    if (response.ErrorType === ErrorTypeEnum.NShiftValidation) {
      const error = response as NShiftException;
      throw new NShiftException(ErrorTypeEnum.NShiftValidation, error.message, error.Errors);
    } else {
      return response;
    }
  }
  /*******************************************
   * Adapter Communication
   ******************************************/
  async mapShipRequest(message: ShipRequestRpcDto): Promise<any> {
    const shipment = await lastValueFrom(this.adapterClient.send(adapterMessages.normalize_ship_request, message));
    return shipment;
  }
  async normalizeShipRequest(message: ShipRequestRpcDto): Promise<any> {
    return await lastValueFrom(this.adapterClient.send(adapterMessages.normalize_ship_request, message));
  }
  async normalizeShipResponse(message: ShipmentRpcDto): Promise<any> {
    return await lastValueFrom(this.adapterClient.send(adapterMessages.normalize_ship_response, message));
  }
  /*******************************************
   * Tenancy Communication
   ******************************************/

  getAllTenants(authentication: string): Observable<any> {
    const payload = { Authentication: authentication };
    return this.tenancyClient.send(tenancyMessages.find_all, payload);
  }
  createTenant(request: CreateTenantDto, authentication: string): Observable<any> {
    const payload = request as CreateTenantRpcDto;
    payload.Authentication = authentication;
    //console.log('sending create_tenant request', payload);
    return this.tenancyClient.send(tenancyMessages.create, request);
  }
  deleteTenant(id: string, authentication: string): Observable<any> {
    const payload = { id: id, Authentication: authentication } as DeleteTenantRpcDto;
    //console.log('sending delete_tenant request', payload);
    return this.tenancyClient.send(tenancyMessages.delete, payload);
  }
  /*
  migratePublic(authentication: string): Observable<any> {
    const payload = { Authentication: authentication };
    return this.tenancyClient.send(tenancyMessages.migrate_public, payload);
  }
  migrateTenants(authentication: string): Observable<any> {
    const payload = { Authentication: authentication };
    return this.tenancyClient.send(tenancyMessages.migrate_tenants, payload);
  }
  */
}
