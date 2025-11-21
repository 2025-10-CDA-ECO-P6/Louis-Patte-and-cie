import type { MockData } from '../types'

export async function fetchMockData(): Promise<MockData> {
  try {
    const response = await fetch('http://localhost:3000/data/mockData.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const data: MockData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mock data:', error);
    throw error;
  }
}

