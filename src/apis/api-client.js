export function extractVideoIdFromLink(url) {
  // return the v parameter of the youtube url, that is the video id
  return new URL(url).searchParams.get("v");
}

export async function processSource(
  source,
  resultType,
  resultLanguage,
  email,
  callback
) {
  console.log("processing", source);

  if (typeof source === "string") {
    callback("Downloading audio...\n");
    await downloadAudioFromVideo(source, callback);
  }
  console.log("audio downloaded!");
  callback("\nTranscribing audio. It takes a while...\n");
  const transcription = await transcribe(source, resultType, callback);
  console.log("audio transcripted!");

  // if it was possible to get the transcription of the audio"
  if (transcription) {
    // if translation is requested, then translate
    if (resultLanguage !== "no translation") {
      callback("\nTranslating transcription...\n");

      console.log("transcription for function translate", typeof transcription);

      const translatedTranscription = await translate(
        transcription,
        resultLanguage,
        callback
      );
      callback("\nDone!");
      return translatedTranscription;
    } else {
      // if no translation requested, return the transcription
      callback("\nDone!");
      return transcription;
    }
  }

  // if no transcription, return false
  return false;
}

export async function downloadAudioFromVideo(videoId, onProgress) {
  console.log("download started");
  // calling the API (backend) to get the audio
  const res = await fetch(
    `http://localhost:3000/api/audio?${new URLSearchParams({
      video_id: videoId,
    })}`
  );

  // result from the api (the body)
  const reader = res.body?.getReader();

  if (reader) {
    return streamedResponse(reader, onProgress);
  }
}

export async function transcribe(source, resultType, onProgress) {
  const res = await fetch(
    `/api/transcript?${new URLSearchParams({
      source,
      resultType,
    })}`,
    {}
  );

  const reader = res.body?.getReader();

  if (reader) {
    console.log("reader", reader);
    return streamedResponse(reader, onProgress);
  } else {
    return false;
  }
}

export async function translate(transcription, resultLanguage, onProgress) {
  console.log("transcription calling", transcription);

  const data = { transcription, resultLanguage };

  const res = await fetch(`/api/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const reader = res.body?.getReader();

  if (reader) {
    return streamedResponse(reader, onProgress);
  } else {
    return false;
  }
}

async function streamedResponse(reader, onProgress) {
  return await new Promise((resolve) => {
    console.log("on progress", reader);
    const decoder = new TextDecoder();
    let result = "";

    const readChunk = ({ done, value }) => {
      if (done) {
        resolve(result);
        return;
      }

      const output = decoder.decode(value);
      result += output;

      onProgress(output);

      reader.read().then(readChunk);
    };

    reader.read().then(readChunk);
  });
}
