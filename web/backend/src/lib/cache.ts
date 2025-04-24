import { LRUCache } from 'lru-cache'

export interface CacheMetadata {
	createdTime: number
	ttl?: number | null
}

export interface CacheEntry<Value = unknown> {
	metadata: CacheMetadata
	value: Value
}

export type Eventually<Value> =
	| Value
	| null
	| undefined
	| Promise<Value | null | undefined>

export interface Cache<Value = any> {
	name?: string
	get: (key: string) => Eventually<CacheEntry<Value>>
	set: (key: string, value: CacheEntry<Value>) => unknown | Promise<unknown>
	delete: (key: string) => unknown | Promise<unknown>
}

function totalTtl(metadata: CacheMetadata) {
	if (!metadata) {
		return 0
	}
	if (metadata.ttl === null) {
		return Infinity
	}
	return metadata.ttl || 0
}

// export declare function createCacheMetaData({ ttl, swr, createdTime, }?: Partial<Omit<CacheMetadata, 'swv'>>): {
//     ttl: number | null;
//     swr: number | null;
//     createdTime: number;
// };
// export declare function createCacheEntry<Value>(value: Value, metadata?: Partial<Omit<CacheMetadata, 'swv'>>): CacheEntry<Value>;

function createCacheMetaData({
	ttl = null,
	createdTime = Date.now(),
}: Partial<CacheMetadata>) {
	return {
		ttl: ttl === Infinity ? null : ttl,
		createdTime,
	}
}

export function createCacheEntry<Value>(
	value: Value,
	metadata: Partial<CacheMetadata>,
): CacheEntry<Value> {
	return {
		value,
		metadata: createCacheMetaData(metadata),
	}
}

const lru = new LRUCache<string, CacheEntry<unknown>>({ max: 5000 })

export const lruCache = {
	name: 'app-memory-cache',
	set: (key, value) => {
		const ttl = totalTtl(value?.metadata)
		lru.set(key, value, {
			ttl: ttl === Infinity ? undefined : ttl,
			start: value?.metadata?.createdTime,
		})
		return value
	},
	get: (key) => lru.get(key),
	delete: (key) => lru.delete(key),
} satisfies Cache
