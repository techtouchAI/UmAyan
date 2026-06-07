import { getCategories, getPosts, getSiteSettings } from "@/lib/api";
import { HomePageClient } from "./HomePageClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();


  return {
    title: settings.siteName,
    description: settings.siteDescription,
  };
}

export default async function Home() {
  const categories = await getCategories();
  const posts = await getPosts();

  return (
    <div className="w-full">
      <HomePageClient categories={categories} initialPosts={posts} />
    </div>
  );
}
