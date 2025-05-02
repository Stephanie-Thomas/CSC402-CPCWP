export async function retryFetchJSON(
    url: string,
    attempts: number = 3,
    delay: number = 2000
  ): Promise<any> {
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          return await res.json();
        }
      } catch (_) {
        // Ignore fetch/network errors and retry
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  
    throw new Error(`Failed to fetch ${url} after ${attempts} attempts`);
  }
  