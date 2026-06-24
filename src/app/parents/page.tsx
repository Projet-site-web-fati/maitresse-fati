import { getAnnouncements, getHomework, getEvents, getDocuments } from "@/lib/queries";
import { getDb } from "@/lib/db";
import ParentsClient from "./ParentsClient";

export default async function ParentsPage() {
  const [announcements, allHomeworks, events, documents] = await Promise.all([
    getAnnouncements(),
    getHomework(),
    getEvents(),
    getDocuments(),
  ]);

  // Filter announcements for parents
  const parentAnnouncements = announcements.filter((a: any) => ['all', 'parents'].includes(a.audience));
  // Limit homeworks to 10
  const homeworks = allHomeworks.slice(0, 10);

  return <ParentsClient announcements={parentAnnouncements} homeworks={homeworks} events={events} documents={documents} />;
}
