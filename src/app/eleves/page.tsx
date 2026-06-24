import { getHomework, getLessons, getResources } from "@/lib/queries";
import ElevesClient from "./ElevesClient";

export default async function ElevesPage() {
  const [homeworks, lessons, resources] = await Promise.all([
    getHomework(),
    getLessons(),
    getResources(),
  ]);

  return <ElevesClient homeworks={homeworks} lessons={lessons} resources={resources} />;
}
