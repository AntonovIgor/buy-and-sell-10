import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OfferService } from './offer-service.interface.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show.bind(this) });
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    if (! offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, offer);
  }
}
