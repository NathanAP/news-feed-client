import type { ApiClient } from './ApiClient'
import type { Source, SourceResponse } from '../../types/source'

export class SourcesService {
    private readonly client: ApiClient

    constructor(client: ApiClient) {
        this.client = client
    }

    async getById(sourceId: string): Promise<Source> {
        const data = await this.client.get<SourceResponse>(
            `/sources/${encodeURIComponent(sourceId)}`,
        )
        return { id: data.id, name: data.name, url: data.url }
    }
}
