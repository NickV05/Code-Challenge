export interface ImageCollection {
  [key: string]: string;
}

export async function importAll(): Promise<ImageCollection> {
  const context = import.meta.glob('/src/assets/tokens/*.svg', { eager: true });
  const images: ImageCollection = {};

  for (const path in context) {
    const key = path.replace('/src/assets/tokens/', '').replace('.svg', '').toLowerCase();
    const module = context[path] as { default: string };
    images[key] = module.default;
  }

  return images;
}