const { uploadPhoto } = require('../../helpers/uploadPhoto');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Firebase işlevlerini taklit ediyoruz
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('uploadPhoto Function Tests', () => {
  const mockBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'; 
  const mockFileName = 'test.png';
  const mockDownloadURL = 'https://fakeurl.com/download/test.png';

  beforeEach(() => {
    ref.mockClear();
    uploadBytes.mockClear();
    getDownloadURL.mockClear();
  });

  it('should upload photo and return download URL', async () => {
    ref.mockReturnValueOnce({});
    uploadBytes.mockResolvedValueOnce({ ref: {} });
    getDownloadURL.mockResolvedValueOnce(mockDownloadURL);

    const url = await uploadPhoto(mockBase64Image, mockFileName);

    expect(uploadBytes).toHaveBeenCalledTimes(1);
    expect(getDownloadURL).toHaveBeenCalledTimes(1);
    expect(url).toBe(mockDownloadURL);
  });

  it('should throw an error if upload fails', async () => {
    const mockError = new Error('Upload failed');
    ref.mockReturnValueOnce({});
    uploadBytes.mockRejectedValueOnce(mockError);

    await expect(uploadPhoto(mockBase64Image, mockFileName)).rejects.toThrow('Upload failed');

    expect(uploadBytes).toHaveBeenCalledTimes(1);
    expect(getDownloadURL).not.toHaveBeenCalled();
  });
});
