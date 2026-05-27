async function test() {
  const url = "http://localhost:3000/api/chat";
  const body = {
    messages: [{ sender: "user", text: "hello" }]
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
  } catch(e) {
    console.error(e);
  }
}
test();
