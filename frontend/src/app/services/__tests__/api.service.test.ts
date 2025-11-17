import apiService from '../api.service';
import axiosInstance from '@/lib/api';

jest.mock('@/lib/api');

describe('apiService', () => {
  const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should make GET request and return data', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockAxios.get.mockResolvedValue({ data: mockData });

      const result = await apiService.get('/test');

      expect(mockAxios.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to GET request', async () => {
      const mockData = { id: 1 };
      const config = { headers: { 'Custom-Header': 'value' } };
      mockAxios.get.mockResolvedValue({ data: mockData });

      await apiService.get('/test', config);

      expect(mockAxios.get).toHaveBeenCalledWith('/test', config);
    });
  });

  describe('post', () => {
    it('should make POST request and return data', async () => {
      const mockData = { id: 1, name: 'Created' };
      const postData = { name: 'New Item' };
      mockAxios.post.mockResolvedValue({ data: mockData });

      const result = await apiService.post('/test', postData);

      expect(mockAxios.post).toHaveBeenCalledWith('/test', postData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should handle POST errors', async () => {
      const error = new Error('Post failed');
      mockAxios.post.mockRejectedValue(error);

      await expect(apiService.post('/test', {})).rejects.toThrow('Post failed');
    });
  });

  describe('put', () => {
    it('should make PUT request and return data', async () => {
      const mockData = { id: 1, name: 'Updated' };
      const putData = { name: 'Updated Item' };
      mockAxios.put.mockResolvedValue({ data: mockData });

      const result = await apiService.put('/test/1', putData);

      expect(mockAxios.put).toHaveBeenCalledWith('/test/1', putData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to PUT request', async () => {
      const config = { headers: { 'Content-Type': 'application/json' } };
      mockAxios.put.mockResolvedValue({ data: {} });

      await apiService.put('/test/1', {}, config);

      expect(mockAxios.put).toHaveBeenCalledWith('/test/1', {}, config);
    });
  });

  describe('patch', () => {
    it('should make PATCH request and return data', async () => {
      const mockData = { id: 1, name: 'Patched' };
      const patchData = { name: 'Patched Item' };
      mockAxios.patch.mockResolvedValue({ data: mockData });

      const result = await apiService.patch('/test/1', patchData);

      expect(mockAxios.patch).toHaveBeenCalledWith('/test/1', patchData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to PATCH request', async () => {
      const config = { params: { includeDeleted: true } };
      mockAxios.patch.mockResolvedValue({ data: {} });

      await apiService.patch('/test/1', {}, config);

      expect(mockAxios.patch).toHaveBeenCalledWith('/test/1', {}, config);
    });
  });

  describe('delete', () => {
    it('should make DELETE request and return data', async () => {
      const mockData = { success: true };
      mockAxios.delete.mockResolvedValue({ data: mockData });

      const result = await apiService.delete('/test/1');

      expect(mockAxios.delete).toHaveBeenCalledWith('/test/1', undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to DELETE request', async () => {
      const config = { params: { force: true } };
      mockAxios.delete.mockResolvedValue({ data: {} });

      await apiService.delete('/test/1', config);

      expect(mockAxios.delete).toHaveBeenCalledWith('/test/1', config);
    });
  });
});

