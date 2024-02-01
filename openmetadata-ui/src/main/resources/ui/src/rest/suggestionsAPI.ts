/*
 *  Copyright 2024 Collate.
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
import { PagingResponse } from 'Models';
import { SuggestionAction } from '../components/MetaPilot/MetaPilotProvider/MetaPilotProvider.interface';
import { Suggestion } from '../generated/entity/feed/suggestion';
import { ListParams } from '../interface/API.interface';
import APIClient from './index';

const BASE_URL = '/suggestions';

export type ListSuggestionsParams = ListParams & {
  entityFQN?: string;
};

export const getMetaPilotSuggestionsList = async (
  params?: ListSuggestionsParams
) => {
  const response = await APIClient.get<PagingResponse<Suggestion[]>>(BASE_URL, {
    params,
  });

  return response.data;
};

export const updateSuggestionStatus = (
  data: Suggestion,
  action: SuggestionAction
): Promise<AxiosResponse> => {
  const url = `${BASE_URL}/${data.id}/${action}`;

  return APIClient.put(url, {});
};
