import { get, post } from './api';

export interface CustomPrintServiceRequestDTO {
  serviceName: string;
  description: string;
  printerModels: string[];
  supportedMaterials: string[];
  minimumPrice: number;
  maxPrintSize: string;
  estimatedProductionDays: number;
}

export const customPrintService = {
  createService: async (serviceData: CustomPrintServiceRequestDTO) => {
    const response = await post('/custom-prints', serviceData);
    return response.data;
  },

  getAllServices: async (params?: any) => {
    const response = await get('/custom-prints', params);
    return response.data;
  },
};
