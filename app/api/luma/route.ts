export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("event_api_id");
    
    if (!eventId) {
      return Response.json({ error: "Missing event_api_id" }, { status: 400 });
    }
    
    const response = await fetch(
      `https://api.lu.ma/event/get?event_api_id=${eventId}`,
      { cache: "no-store" }
    );
    
    if (!response.ok) {
      return Response.json({ error: "Failed to fetch event from Luma" }, { status: response.status });
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error("Luma fetch error:", error);
    return Response.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
