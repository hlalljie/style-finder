import { renderHook } from '@testing-library/react';
import * as hook from './useSearch';

describe('useSearch', () => {
    const mockPollForUpdates = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(hook, 'useSearch').mockImplementation(() => ({
            handleSearch: hook.useSearch().handleSearch,
            pollForUpdates: mockPollForUpdates,
            handleStop: jest.fn()
        }));

        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve({ tracker: '123' })
        });
    });

    it('verifies pollForUpdates call', async () => {
        const { result } = renderHook(() => hook.useSearch());
        await result.current.handleSearch();
        expect(mockPollForUpdates).toHaveBeenCalledWith('123', 1);
    });
});