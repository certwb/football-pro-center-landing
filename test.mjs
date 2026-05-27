async function test() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCCijIw3xdaK6RfFYG01kJ8kyZGdQ0XY58";
  try {
    const res = await fetch(url);
    const json = await res.json();
    const models = json.models.map(m => m.name);
    console.log("AVAILABLE MODELS:", models.filter(m => m.includes("gemini")));
  } catch(e) {
    console.error(e);
  }
}
test();
