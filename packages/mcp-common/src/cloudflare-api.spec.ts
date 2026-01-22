import { vi, describe, expect, it } from 'vitest'
import { fetchCloudflareApi } from './cloudflare-api'

describe('fetchCloudflareApi', () => {
	it('protects against path traversal', async () => {
		const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"res": "ok"}'))

		for (const testCase of [
			{ accountId: 'abcd', endpoint: '/dex/http-tests/../../user', apiToken: '', },
			{ accountId: 'abcd', endpoint: '/dex/http-tests/..', apiToken: '', },
			{ accountId: 'abcd', endpoint: '/dex/http-tests/%2e%2e/user', apiToken: '', },
			{ accountId: 'abcd', endpoint: '/dex/http-tests/%2e%2e', apiToken: '', },
			{ accountId: 'abcd', endpoint: '/dex/http-tests/%2E%2E/user', apiToken: '', },
			{ accountId: 'abcd', endpoint: '/dex/http-tests/%2e%2e%2fuser', apiToken: '', },
		]) {
			await expect(fetchCloudflareApi(testCase)).rejects.toThrow()
			expect(fetchSpy).not.toHaveBeenCalled()
		}
	})
})
