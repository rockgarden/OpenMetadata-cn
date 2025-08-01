/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { AxiosResponse } from 'axios';
import { Operation } from 'fast-json-patch';
import { PagingResponse, PagingWithoutTotal, RestoreRequestType } from 'Models';
import { QueryVote } from '../components/Database/TableQueries/TableQueries.interface';
import {
  APPLICATION_JSON_CONTENT_TYPE_HEADER,
  PAGE_SIZE,
} from '../constants/constants';
import { Chart } from '../generated/entity/data/chart';
import { EntityHistory } from '../generated/type/entityHistory';
import { EntityReference } from '../generated/type/entityReference';
import { Include } from '../generated/type/include';
import { Paging } from '../generated/type/paging';
import { ListParams } from '../interface/API.interface';
import { ServicePageData } from '../pages/ServiceDetailsPage/ServiceDetailsPage.interface';
import { getEncodedFqn } from '../utils/StringsUtils';
import APIClient from './index';

export type ListDataModelParams = {
  service?: string;
  fields?: string;
  after?: string;
  before?: string;
  include?: Include;
  limit?: number;
};

const BASE_URL = '/charts';

export const getChartVersions = async (id: string) => {
  const url = `${BASE_URL}/${id}/versions`;

  const response = await APIClient.get<EntityHistory>(url);

  return response.data;
};
export const getChartVersion = async (id: string, version?: string) => {
  const url = `${BASE_URL}/${id}/versions/${version}`;

  const response = await APIClient.get<Chart>(url);

  return response.data;
};

export const getCharts = async (
  service: string,
  fields: string,
  paging?: PagingWithoutTotal,
  include: Include = Include.NonDeleted,
  limit: number = PAGE_SIZE
) => {
  const response = await APIClient.get<{
    data: ServicePageData[];
    paging: Paging;
  }>(`${BASE_URL}`, {
    params: {
      service,
      fields,
      limit,
      ...paging,
      include,
    },
  });

  return response.data;
};

export const getChartByFqn = async (fqn: string, params?: ListParams) => {
  const response = await APIClient.get<Chart>(
    `${BASE_URL}/name/${getEncodedFqn(fqn)}`,
    {
      params: { ...params, include: params?.include ?? Include.All },
    }
  );

  return response.data;
};

export const addFollower = async (chartID: string, userId: string) => {
  const response = await APIClient.put<
    string,
    AxiosResponse<{
      changeDescription: { fieldsAdded: { newValue: EntityReference[] }[] };
    }>
  >(
    `${BASE_URL}/${chartID}/followers`,
    userId,
    APPLICATION_JSON_CONTENT_TYPE_HEADER
  );

  return response.data;
};

export const removeFollower = async (chartID: string, userId: string) => {
  const response = await APIClient.delete<{
    changeDescription: { fieldsDeleted: { oldValue: EntityReference[] }[] };
  }>(
    `${BASE_URL}/${chartID}/followers/${userId}`,
    APPLICATION_JSON_CONTENT_TYPE_HEADER
  );

  return response.data;
};

export const patchChartDetails = async (id: string, data: Operation[]) => {
  const response = await APIClient.patch<Operation[], AxiosResponse<Chart>>(
    `${BASE_URL}/${id}`,
    data
  );

  return response.data;
};

export const restoreChart = async (id: string) => {
  const response = await APIClient.put<
    RestoreRequestType,
    AxiosResponse<Chart>
  >(`${BASE_URL}/restore`, { id });

  return response.data;
};

export const getDataModels = async (params?: ListDataModelParams) => {
  const response = await APIClient.get<PagingResponse<ServicePageData[]>>(
    `/chart/datamodels`,
    {
      params,
    }
  );

  return response.data;
};

export const updateChartVotes = async (id: string, data: QueryVote) => {
  const response = await APIClient.put<QueryVote, AxiosResponse<Chart>>(
    `${BASE_URL}/${id}/vote`,
    data
  );

  return response.data;
};
