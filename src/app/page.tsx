import HomeClient from "./HomeClient";
import { getAnnouncements, getHomework } from "@/lib/queries";

export default async function Home() {
  const [announcements, homeworks] = await Promise.all([
    getAnnouncements(),
    getHomework(),
  ]);

  return <HomeClient announcements={announcements.slice(0, 4)} homeworks={homeworks.slice(0, 4)} />;
}
