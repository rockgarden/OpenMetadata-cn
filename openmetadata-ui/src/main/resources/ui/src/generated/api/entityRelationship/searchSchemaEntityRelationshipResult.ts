/*
 *  Copyright 2025 Collate.
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
/**
 * Paginated response for Search Schema Entity Relationship, including ER diagram data and
 * paging metadata.
 */
export interface SearchSchemaEntityRelationshipResult {
    data:   SearchEntityRelationshipResult;
    paging: Paging;
}

/**
 * Search Entity Relationship Response for the Entity Relationship Request
 */
export interface SearchEntityRelationshipResult {
    /**
     * Downstream Edges for the node.
     */
    downstreamEdges?: any;
    /**
     * Nodes in the entity relationship response.
     */
    nodes?: any;
    /**
     * Upstream Edges for the entity.
     */
    upstreamEdges?: any;
}

/**
 * Type used for cursor based pagination information in GET list responses.
 */
export interface Paging {
    /**
     * After cursor used for getting the next page (see API pagination for details).
     */
    after?: string;
    /**
     * Before cursor used for getting the previous page (see API pagination for details).
     */
    before?: string;
    /**
     * Limit used in case of offset based pagination.
     */
    limit?: number;
    /**
     * Offset used in case of offset based pagination.
     */
    offset?: number;
    /**
     * Total number of entries available to page through.
     */
    total: number;
}
