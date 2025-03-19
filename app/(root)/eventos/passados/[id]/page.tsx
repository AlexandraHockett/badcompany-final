import EventDetailsClient from "@/components/EventDetailsClient";
import { events, getEventById } from "@/data/eventos/eventsContent";
import { notFound } from "next/navigation";

type EventPageProps = {
  params: {
    id: string;
  };
};

export default function EventPage({ params }: EventPageProps) {
  const event = getEventById(params.id);

  if (!event) {
    return notFound();
  }

  return (
    <main className="min-h-screen">
      <EventDetailsClient event={event} />
    </main>
  );
}

export async function generateStaticParams() {
  return events.map((event) => ({
    id: event.id,
  }));
}
