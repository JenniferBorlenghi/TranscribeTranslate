// @ts-check
const { test, expect } = require("@playwright/test");
const path = require("path");

test("youtube video transcription and translation", async ({ page }) => {
  test.setTimeout(1200000);

  await page.goto("http://localhost:3001/");

  // Select the radio button for source as youtube video
  await page.check("input[value='youtube']");

  // Fill with the youtube URL
  await page.fill(
    "#youtube-url",
    "https://www.youtube.com/watch?v=fsip5RMZNkw&ab_channel=TorontoDrivers"
  );

  // Select the radio button for the result type as text
  await page.check("input[value='text']");

  // Select the language result as portuguese
  await page.selectOption("select", "portuguese");

  // Fill with the user email
  await page.fill("input[type='email']", "jenniferborlenghi@yahoo.com.br");

  // Submit the form
  await page.click("#submit-form");

  // processing page
  await page.waitForSelector(".processing-ai", { state: "attached" });

  // result page
  await page.waitForSelector(".output-place", { state: "attached" });

  const resultText = await page.textContent(".output-place");

  const errorMessage =
    "There was an error while processing your source. Please try again at a later time";

  await expect(resultText).not.toBe(errorMessage);
});

test("audio file transcription and translation", async ({ page }) => {
  test.setTimeout(1200000);

  await page.goto("http://localhost:3001/");

  // Select the radio button for source as audio file
  await page.check("input[value='audio']");

  // upload the file from the tests folder
  const audioPath = path.join(process.cwd(), "/tests/audio-test.mp3");

  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles(audioPath);

  // Select the radio button for the result type as text
  await page.check("input[value='text']");

  // Select the language result as portuguese
  await page.selectOption("select", "filipino");

  // Fill with the user email
  await page.fill("input[type='email']", "jenniferborlenghi@yahoo.com.br");

  // Submit the form
  await page.click("#submit-form");

  // processing page
  await page.waitForSelector(".processing-ai", { state: "attached" });

  // result page
  await page.waitForSelector(".output-place", { state: "attached" });

  const resultText = await page.textContent(".output-place");

  const errorMessage =
    "There was an error while processing your source. Please try again at a later time";

  await expect(resultText).not.toBe(errorMessage);
});
