import {
  JwtAuthGuard,
  GoodsTypeSelctionRpc,
  ShipmentDto,
  ShippersService,
  SubmitShipmentRpc,
  ProductDeterminationRpc,
  NShiftServicesRpc,
  PaymentTermsService,
  IncotermsService,
} from '@app/common';
import {
  Controller,
  Get,
  Post,
  Logger,
  Req,
  UseGuards,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UseFilters,
  HttpException,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import {
  CreateTenantDto,
  tenancyMessages,
  adapterMessages,
  TenantAdminAuthGuard,
  nshiftMessages,
  BaseRpc,
  ErrorInterceptor,
  HttpExceptionFilter,
} from '@app/common';

import {
  ShipRequestDto,
  ShipExecRequestInterceptor,
  ShipResult,
  ShipmentResponse,
  ShipRequestRpcDto,
  VoidPackagesRequest,
  VoidPackagesResult,
  VoidPackagesRequestDto,
  //ShipexecExceptionFilter,
} from '@app/shipexec';
import { Request as ExpressRequest } from 'express';
//import { tenant } from '@app/skipum';

import { JwtService } from '@nestjs/jwt';
//import { CarrierServiceMappingsService } from './modules/carrier-service-mappings/carrier-service-mappings.service';
import { AddressTypeEnum, ShipmentRpcDto, tenant } from '@app/skipum';
//import { NShiftException } from '@app/nshift-types';
import { ServicesService } from '@app/common';

@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ApiController {
  logger: Logger;
  constructor(
    private readonly apiService: ApiService,
    private readonly servicesService: ServicesService,
    private readonly shippersService: ShippersService,
    private readonly paymentTermsService: PaymentTermsService,
  ) {
    this.logger = new Logger('ApiController') as Logger;
  }

  /*******************************************
   * Health
   ******************************************/
  @ApiTags('Health')
  @UseGuards(TenantAdminAuthGuard)
  @Get(tenancyMessages.ping)
  pingTenancyConnection(@Req() req: ExpressRequest): Observable<any> {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.pingTenancyConnection(message);
  }

  @ApiTags('Health')
  @Get(adapterMessages.ping)
  pingAdapterConnection(@Req() req: ExpressRequest): Observable<any> {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.pingAdapterConnection(message);
  }

  @ApiTags('Health')
  @Get(nshiftMessages.ping)
  pingNShiftConnection(@Req() req: ExpressRequest): Observable<any> {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.pingNShiftConnection(message);
  }

  @ApiTags('Health')
  @Get('health')
  healthCheck(): string {
    return this.apiService.healthCheck();
  }

  /*
  @ApiTags('ErrorHandling')
  @Get(nshiftMessages.handle_error)
  handleNShiftExcept(@Req() req: ExpressRequest): Promise<any> {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.handleNShiftError(message);
  }
  */

  /*******************************************
   * Auth
   ******************************************/
  @ApiTags('Auth')
  @Get('me')
  @ApiOperation({ summary: 'Who am I?' })
  logUser(@Req() req: any): any {
    delete req.user.password;
    return req.user;
  }

  @ApiTags('Auth')
  @Get('token')
  @ApiOperation({ summary: 'Decode JWT Token' })
  decodeToken(@Req() req: any): any {
    const token = req.headers.authorization.replace('Bearer ', '');
    const jwtService = new JwtService();

    const decoded = jwtService.decode(token);
    return decoded;
  }

  /*******************************************
   * Shippers and Services
   * *****************************************/
  @ApiTags('Common Tenanted')
  @Get('services')
  @ApiOperation({ summary: 'Find all Services' })
  findAllServices() {
    return this.servicesService.findAll();
  }
  @ApiTags('Common Tenanted')
  @Get('services/:shipperId')
  @ApiOperation({ summary: 'Find all Services by Shipper ID' })
  findServicesByShipper(@Param('shipperId') shipperId: string) {
    return this.servicesService.findByShipper(shipperId);
  }
  @ApiTags('Common Tenanted')
  @Get('shippers')
  @ApiOperation({ summary: 'Find all Shippers' })
  findallShippers() {
    return this.shippersService.findAll();
  }

  @ApiTags('Common Tenanted')
  @Get('shipper/:code')
  @ApiOperation({ summary: 'Find Shipper' })
  findShipper(@Param('code') code: string) {
    this.logger.log(`Find Shipper by code: ${code}`);
    return this.shippersService.findByCode(code);
  }

  @ApiTags('Common Tenanted')
  @Get('paymentTerms')
  @ApiOperation({ summary: 'Find all Payment Terms' })
  findallPaymentTerms() {
    return this.paymentTermsService.findAll();
  }
  /*
  @ApiTags('Common Tenanted')
  @Get('intoterms')
  @ApiOperation({ summary: 'Find all Incoterms' })
  findallIncoterms() {
    return this.incotermsService.findAll();
  }
  */
  /*******************************************
   * NShift
   ******************************************/
  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Profile' })
  @Get('nshift/profile')
  getNShiftProfile(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftProfile(message);
  }

  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Carriers' })
  @Get('nshift/carriers')
  getNShiftCarriers(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftCarriers(message);
  }

  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Subcarriers' })
  @Get('nshift/subcarriers')
  getNShiftSubcarriers(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftSubcarriers(message);
  }

  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Subcarriers' })
  @Get('nshift/products')
  getNShiftProducts(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftProducts(message);
  }

  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Detail Groups' })
  @Get('nshift/detailGroups')
  getNShiftDetailGroups(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftDetailGroups(message);
  }

  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Details' })
  @Get('nshift/details')
  getNShiftDetails(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftDetails(message);
  }

  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Services' })
  @Get('nshift/services/:removeDuplicateServiceCode')
  getNShiftServices(@Req() req: any, @Param('removeDuplicateServiceCode') removeDuplicates: boolean) {
    const message = this.apiService.getBaseRpcMessage(req) as NShiftServicesRpc;
    message.removeDuplicateServiceCodes = removeDuplicates;
    return this.apiService.getNShiftServices(message);
  }

  @ApiTags('NShift API')
  @ApiOperation({ summary: 'Get NShift Goods Types' })
  @Get('nshift/goodsTypes')
  getNShiftGoodsTypes(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftGoodsTypes(message);
  }

  /*
  @ApiTags('NShift')
  @ApiOperation({ summary: 'Map Shipment to Submit Shipment' })
  @Post('nshift/mapShipmentToSubmitShipment')
  mapSubmitShipment(@Body() shipment: ShipmentDto, @Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as SubmitShipmentRpc;
    message.Shipment = shipment;
    return this.apiService.mapSubmitShipment(message);
  }
  */

  @ApiTags('NShift Data')
  @ApiOperation({ summary: 'Get All Product Determinations' })
  @Get('nshift/productDetermination')
  allProductDeterminations(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftProductDeterminations(message);
  }

  @ApiTags('NShift Data')
  @ApiOperation({ summary: 'Find ProdConceptId by Service and Route' })
  @Get('nshift/productDetermination/:serviceId/:originCountry/:destinationCountry')
  findProductDetermination(
    @Req() req: any,
    @Param('serviceId') serviceId: string,
    @Param('originCountry') originCountry: string,
    @Param('destinationCountry') destinationCountry: string,
  ) {
    const message = this.apiService.getBaseRpcMessage(req) as ProductDeterminationRpc;
    message.ServiceId = serviceId;
    message.OriginCountry = originCountry;
    message.DestinationCountry = destinationCountry;
    return this.apiService.findNShiftProductDetermination(message);
  }

  @ApiTags('NShift Data')
  @ApiOperation({ summary: 'Get All NShift Customer Packaging' })
  @Get('nshift/packaging')
  getCustomerPackaging(@Req() req: any) {
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    return this.apiService.getNShiftCustomerPackaging(message);
  }

  @ApiTags('NShift Data')
  @ApiOperation({ summary: 'Get NShift Goods Type by packaging material' })
  @Get('nshift/goodsType/:packaging/:prodConceptId')
  getGoodsTypeByPackaging(
    @Req() req: any,
    @Param('packaging') packaging: string,
    @Param('prodConceptId') prodConceptId: number,
  ) {
    const message = this.apiService.getBaseRpcMessage(req) as GoodsTypeSelctionRpc;
    message.Packaging = packaging;
    message.ProdConceptId = prodConceptId;
    return this.apiService.getNShiftGoodsTypeByPackaging(message);
  }

  /*******************************************
   * Shipping
   ******************************************/
  @ApiTags('Shipping')
  @ApiOperation({ summary: 'Map ShipRequest to Skipum Shipment' })
  @Post('normalize/ShipRequest1')
  @UseInterceptors(ShipExecRequestInterceptor)
  async normalizeShipRequest(@Body() shipRequest: ShipRequestDto, @Req() req: any) {
    const messageRpc = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    const shipRequestRpcDto = messageRpc as ShipRequestRpcDto;
    shipRequestRpcDto.ShipRequest = shipRequest;
    const shipperCode = shipRequest.ShipmentRequest.PackageDefaults.Shipper;
    shipRequestRpcDto.Shipper = await this.shippersService.findByCode(shipperCode);
    return await this.apiService.normalizeShipRequest(shipRequestRpcDto);
  }

  @ApiTags('Shipping')
  @ApiOperation({ summary: 'Map ShipRequest to NShift Shipment' })
  @Post('normalize/shipRequest2')
  @UseInterceptors(ShipExecRequestInterceptor)
  async mapShipRequest(@Body() shipRequest: ShipRequestDto, @Req() req: any) {
    const messageRpc = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    const shipRequestRpcDto = messageRpc as ShipRequestRpcDto;
    shipRequestRpcDto.ShipRequest = shipRequest;
    const shipperCode = shipRequest.ShipmentRequest.PackageDefaults.Shipper;
    shipRequestRpcDto.Shipper = await this.shippersService.findByCode(shipperCode);
    const shipment = await this.apiService.normalizeShipRequest(shipRequestRpcDto);

    // ******************************************************
    // ******************************************************
    // Map Shipment via NShift Container
    // ******************************************************
    const submitShipmentMessage = messageRpc as SubmitShipmentRpc;
    submitShipmentMessage.Shipment = shipment;
    const unshippedNShiftShipment = await this.apiService.mapNShiftShipment(submitShipmentMessage);
    return unshippedNShiftShipment;
  }

  /*
  @ApiTags('Shipping')
  @ApiOperation({ summary: 'Debug Ship Process' })
  @Post('debug')
  @UseInterceptors(ShipExecRequestInterceptor)
  async productDetermination(
    @Req() req: any,
    @Body()
    shipRequest: ShipRequestDto,
  ): Promise<any> {
    const messageRpc = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    const shipRequestRpcDto = messageRpc as ShipRequestRpcDto;
    shipRequestRpcDto.ShipRequest = shipRequest;
    const shipment = await this.apiService.normalizeShipRequest(shipRequestRpcDto);
    /*
    const carrierServiceMappings = await this.carrierServiceMappingsService.findByCarrierServiceId(
      shipment.Service_code,
    );
    
    
    const productConceptId = this.apiService.productDetermination(shipment, carrierServiceMappings);
    const productConceptId = 1947; //TNT International

    // ******************************************************
    // Ship Shipment via NShift
    const message = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    const submitShipmentMessage = message as SubmitShipmentRpc;
    submitShipmentMessage.Shipment = shipment;
    const shippedShipment = await this.apiService.submitNShiftShipment(submitShipmentMessage);
    // ******************************************************

    this.logger.log('processing shippedShipment', shippedShipment);
    const shipmentRpcDto = message as ShipmentRpcDto;
    shipmentRpcDto.Shipment = shippedShipment;
    const shipmentResponse = (await this.apiService.normalizeShipResponse(shipmentRpcDto)) as ShipmentResponse;

    return {
      ErrorCode: '0',
      ErrorMessage: 'No Error',
      normalizeShipment: shipment,
      //carrierServiceMappings: carrierServiceMappings,
      productConceptId: productConceptId,
      shippedShipment: shippedShipment,
      shipmentResponse: shipmentResponse,
    };
  }
  */

  // ******************************************************
  // Normalize Ship Response
  // ******************************************************
  @ApiTags('Shipping')
  @ApiOperation({ summary: 'Void Package(s)' })
  @Post('void')
  @UseFilters(new HttpExceptionFilter())
  //@UseInterceptors(ShipExecRequestInterceptor)
  //@UseFilters(new ShipexecExceptionFilter())
  async void(
    @Req() req: any,
    @Body()
    voidRequest: VoidPackagesRequestDto,
  ): Promise<VoidPackagesResult> {
    // ******************************************************
    return {
      ErrorCode: '0',
      ErrorMessage: 'Not implemented',
      Packages: {
        Package: [],
      },
    };
  }

  @ApiTags('Shipping')
  @ApiOperation({ summary: 'Ship a Movement and Return Skipum Shipment' })
  @Post('ship1')
  @UseInterceptors(ShipExecRequestInterceptor)
  @UseFilters(new HttpExceptionFilter())
  async ship1(
    @Req() req: any,
    @Body()
    shipRequest: ShipRequestDto,
  ): Promise<any> {
    // ******************************************************
    // Normalize Ship Request
    const messageRpc = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    const shipRequestRpcDto = messageRpc as ShipRequestRpcDto;
    shipRequestRpcDto.ShipRequest = shipRequest;

    const shipperCode = shipRequest.ShipmentRequest.PackageDefaults.Shipper;
    shipRequestRpcDto.Shipper = await this.shippersService.findByCode(shipperCode);

    // Adapter Module
    const shipment = await this.apiService.normalizeShipRequest(shipRequestRpcDto);

    // ******************************************************
    // ******************************************************
    // Ship Shipment via NShift Engine
    // ******************************************************
    const submitShipmentMessage = messageRpc as SubmitShipmentRpc;
    submitShipmentMessage.Shipment = shipment;
    const shippedShipment = await this.apiService.submitNShiftShipment(submitShipmentMessage);

    // Persist Shipment to DB
    // TODO: Persist shippedShipment.ShipmentEntity to DB here

    return {
      ErrorCode: '0',
      ErrorMessage: 'No Error',
      Shipment: shippedShipment,
    };
  }

  @ApiTags('Shipping')
  @ApiOperation({ summary: 'Ship a Movement and Return Shipexec 2.0 Response' })
  @Post('ship')
  @UseInterceptors(ShipExecRequestInterceptor)
  @UseFilters(new HttpExceptionFilter())
  //@UseInterceptors(ShipExecRequestInterceptor)
  //@UseFilters(new ShipexecExceptionFilter())
  async ship(
    @Req() req: any,
    @Body()
    shipRequest: ShipRequestDto,
  ): Promise<ShipResult> {
    // ******************************************************
    // Normalize Ship Request
    const messageRpc = this.apiService.getBaseRpcMessage(req) as BaseRpc;
    const shipRequestRpcDto = messageRpc as ShipRequestRpcDto;
    shipRequestRpcDto.ShipRequest = shipRequest;

    const shipperCode = shipRequest.ShipmentRequest.PackageDefaults.Shipper;
    shipRequestRpcDto.Shipper = await this.shippersService.findByCode(shipperCode);

    // Adapter Module
    const shipment = await this.apiService.normalizeShipRequest(shipRequestRpcDto);

    /*
    const shipper = await this.shippersService.findByCode(shipment.Shipper_code);

    // If Goods Origin Partner is not found, add Shipper as Goods Origin Partner
    const GoodsOriginPartner = this.apiService.getPartner(AddressTypeEnum.GoodsOrigin, shipment.toPartners);
    if (!GoodsOriginPartner) {
      const shipperPartner = this.apiService.getPartner(AddressTypeEnum.GoodsOrigin, shipper.toAddress);
      if (shipperPartner) {
        shipment.toPartners.push(shipperPartner);
        this.logger.debug('Shipper Found and Partner Added', JSON.stringify(shipperPartner));
      }
    }
    */

    // ******************************************************
    // ******************************************************
    // Ship Shipment via NShift Engine
    // ******************************************************
    const submitShipmentMessage = messageRpc as SubmitShipmentRpc;
    submitShipmentMessage.Shipment = shipment;
    const shippedShipment = await this.apiService.submitNShiftShipment(submitShipmentMessage);

    // ******************************************************
    // Normalize Ship Response
    // ******************************************************
    const shipmentRpcDto = messageRpc as ShipmentRpcDto;
    shipmentRpcDto.Shipment = shippedShipment;
    const shipmentResponse = (await this.apiService.normalizeShipResponse(shipmentRpcDto)) as ShipmentResponse;

    return {
      ErrorCode: '0',
      ErrorMessage: 'No Error',
      ShipmentResponse: shipmentResponse,
    };
  }

  /*******************************************
   * Tenancy & Migrations
   ******************************************/
  /*
  @ApiTags('Migrations')
  @ApiOperation({ summary: 'Migrate All Tenants' })
  @Post('migrate/tenants')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantAdminAuthGuard)
  migrateTenants(@Req() req: any) {
    const authentication = req.cookies?.Authentication || req.headers.authorization;
    return this.apiService.migrateTenants(authentication);
  }

  @ApiTags('Migrations')
  @ApiOperation({ summary: 'Migrate Public Schema' })
  @Post('migrate/public')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantAdminAuthGuard)
  migratePublic(@Req() req: any) {
    const authentication = req.cookies?.Authentication || req.headers.authorization;
    return this.apiService.migratePublic(authentication);
  }
  */

  @ApiTags('Tenancy')
  @ApiOperation({ summary: 'Get All Tenants' })
  @Get('tenant')
  @UseGuards(TenantAdminAuthGuard)
  getAllTenants(@Req() req: any) {
    const authentication = req.cookies?.Authentication || req.headers.authorization;
    return this.apiService.getAllTenants(authentication);
  }

  @ApiTags('Tenancy')
  @ApiOperation({ summary: 'Create a tenant' })
  @Post('tenant')
  @UseGuards(TenantAdminAuthGuard)
  create(@Body() request: CreateTenantDto, @Req() req: any) {
    const authentication = req.cookies?.Authentication || req.headers.authorization;
    return this.apiService.createTenant(request, authentication);
  }
  @ApiTags('Tenancy')
  @ApiOperation({ summary: 'Delete a tenant' })
  @Delete('tenant/:id')
  @UseGuards(TenantAdminAuthGuard)
  deleteTenant(@Req() req: any, @Param('id') id: string) {
    const authentication = req.cookies?.Authentication || req.headers.authorization;
    return this.apiService.deleteTenant(id, authentication);
  }
}
