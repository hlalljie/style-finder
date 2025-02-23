import { ResultData, BrandData } from './types';

describe('ResultData', () => {
  it('should create instance with complete data', () => {
    const mockData = {
      error: new Error('test error'),
      received: 'https://test.com',
      brandData: {
        colors: {
          '#000000': ['header', 'footer'],
          '#FFFFFF': ['background']
        },
        fonts: {
          'Arial': ['body', 'nav'],
          'Helvetica': ['headers']
        }
      },
      parsedData: 'test parsed data'
    };

    const result = new ResultData(mockData);

    // Verify all properties were set correctly
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('test error');
    expect(result.received).toBe('https://test.com');
    expect(result.parsedData).toBe('test parsed data');

    // Verify BrandData was properly instantiated
    expect(result.brandData).toBeInstanceOf(BrandData);
    expect(result.brandData?.colors).toEqual({
      '#000000': ['header', 'footer'],
      '#FFFFFF': ['background']
    });
    expect(result.brandData?.fonts).toEqual({
      'Arial': ['body', 'nav'],
      'Helvetica': ['headers']
    });
  });

  it('should handle missing optional fields', () => {
    const mockData = {
      received: 'https://test.com',
    };

    const result = new ResultData(mockData);
    
    // Verify required fields
    expect(result.received).toBe('https://test.com');
    
    // Verify optional fields are undefined
    expect(result.error).toBeUndefined();
    expect(result.brandData).toBeUndefined();
    expect(result.parsedData).toBeUndefined();
  });

  it('should handle empty brandData object', () => {
    const mockData = {
      received: 'https://test.com',
      brandData: {}
    };

    const result = new ResultData(mockData);
    
    expect(result.brandData).toBeInstanceOf(BrandData);
    expect(result.brandData?.colors).toBeUndefined();
    expect(result.brandData?.fonts).toBeUndefined();
  });
});

describe('BrandData', () => {
  it('should create instance with complete data', () => {
    const mockData = {
      colors: {
        '#FF0000': ['button', 'alert'],
        '#00FF00': ['success']
      },
      fonts: {
        'Roboto': ['main', 'nav'],
        'OpenSans': ['paragraphs']
      }
    };

    const result = new BrandData(mockData);

    // Verify colors were set correctly
    expect(result.colors).toBeDefined();
    expect(Object.keys(result.colors!)).toHaveLength(2);
    expect(result.colors!['#FF0000']).toEqual(['button', 'alert']);
    expect(result.colors!['#00FF00']).toEqual(['success']);

    // Verify fonts were set correctly
    expect(result.fonts).toBeDefined();
    expect(Object.keys(result.fonts!)).toHaveLength(2);
    expect(result.fonts!['Roboto']).toEqual(['main', 'nav']);
    expect(result.fonts!['OpenSans']).toEqual(['paragraphs']);
  });

  it('should handle missing fonts', () => {
    const mockData = {
      colors: {
        '#FF0000': ['button']
      }
    };

    const result = new BrandData(mockData);
    
    expect(result.colors).toBeDefined();
    expect(result.colors!['#FF0000']).toEqual(['button']);
    expect(result.fonts).toBeUndefined();
  });

  it('should handle missing colors', () => {
    const mockData = {
      fonts: {
        'Roboto': ['main']
      }
    };

    const result = new BrandData(mockData);
    
    expect(result.colors).toBeUndefined();
    expect(result.fonts).toBeDefined();
    expect(result.fonts!['Roboto']).toEqual(['main']);
  });

  it('should handle empty object', () => {
    const mockData = {};

    const result = new BrandData(mockData);
    
    expect(result.colors).toBeUndefined();
    expect(result.fonts).toBeUndefined();
  });
});