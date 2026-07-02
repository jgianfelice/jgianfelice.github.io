import { loadHomeContent } from '@/lib/content';
import Experience from '@/components/Experience';

export const revalidate = 300;

export default async function Home() {
  const content = await loadHomeContent();
  return <Experience content={content} />;
}
