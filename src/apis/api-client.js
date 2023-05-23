export function extractVideoIdFromLink(url) {
  // return the v parameter of the youtube url, that is the video id
  return new URL(url).searchParams.get("v");
}

export async function processSource(
  videoId,
  resultType,
  resultLanguage,
  email,
  callback
) {
  console.log("processing", videoId);
  callback("Downloading audio...\n");
  await downloadAudioFromVideo(videoId, callback);

  // callback("\nTranscribing audio. It takes a while...\n");
  // const transcription = await transcribe(videoId, resultType, callback);

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
  console.log("search", res);

  // result from the api (the body)
  const reader = res.body?.getReader();

  if (reader) {
    return streamedResponse(reader, onProgress);
  }
}

async function streamedResponse(reader, onProgress) {
  return await new Promise((resolve) => {
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
