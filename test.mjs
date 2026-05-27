async function test() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCCijIw3xdaK6RfFYG01kJ8kyZGdQ0XY58";
  const body = {
    contents: [{ parts: [{ text: "hello" }] }]
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
