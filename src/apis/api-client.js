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

  callback("\nTranscribing audio. It takes a while...\n");
  const transcription = await transcribe(source, resultType, callback);

  console.log("transcription", transcription);

  // // if it was possible to get the transcription of the audio"
  // if (transcription) {
  //   console.log("transcription", transcription);

  //   // // if translation is requested, then translate
  //   // if (resultLanguage !== "no translation") {
  //   //   callback("\nTranslating transcription...\n");
  //   //   const translatedTranscription = await translate(
  //   //     transcription,
  //   //     resultLanguage,
  //   //     callback
  //   //   );
  //   //   callback("\nDone!");
  //   //   return translatedTranscription;
  //   // } else {
  //   //   // if no translation requested, return the transcription
  //   //   callback("\nDone!");
  //   //   return transcription;
  //   // }
  // }

  // // if no transcription, return false
  // return false;
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

export async function transcribe(source, onProgress) {
  const res = await fetch(
    `/api/transcript?${new URLSearchParams({ source: source })}`,
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

async function streamedResponse(reader, onProgress) {
  return await new Promise((resolve) => {
    console.log("on progress", onProgress);
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
