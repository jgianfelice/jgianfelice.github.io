import { getHomeContent } from '@/lib/notion';
import Experience from '@/components/Experience';

export const revalidate = 300;

export default async function Home() {
  const content = await getHomeContent();
  return <Experience content={content} />;
}
