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
  let transcription = "";

  if (typeof source === "string") {
    callback("Downloading audio...\n");
    await downloadAudioFromVideo(source, callback);

    callback("\nTranscribing audio from Youtube. It takes a while...\n");
    transcription = await transcribeAudioFromVideo(
      source,
      resultType,
      callback
    );
    console.log("transcription youtube", transcription);
  } else {
    callback("Downloading audio...\n");
    await uploadAudio(source, callback);
    console.log("audio uploaded");

    transcription = await transcribeAudioFromAudio(
      source,
      resultType,
      callback
    );
    console.log("trascription Audio", transcription);
  }

  // if it was possible to get the transcription of the audio"
  if (transcription) {
    // if translation is requested, then translate
    if (resultLanguage !== "no translation") {
      callback("\nTranslating transcription...\n");

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

export async function uploadAudio(source, onProgress) {
  const res = await fetch("/api/upload", {
    method: "POST",
    body: source,
  });

  const reader = res.body?.getReader();

  if (reader) {
    return streamedResponse(reader, onProgress);
  } else {
    return false;
  }
}

export async function transcribeAudioFromVideo(source, resultType, onProgress) {
  console.log("source", typeof source);

  const res = await fetch(
    `/api/transcript/youtube?${new URLSearchParams({
      source,
      resultType,
    })}`,
    {}
  );

  const reader = res.body?.getReader();

  if (reader) {
    return streamedResponse(reader, onProgress);
  } else {
    return false;
  }
}

export async function transcribeAudioFromAudio(source, resultType, onProgress) {
  source.append("resultType", resultType);

  const res = await fetch("/api/transcript/audio", {
    method: "POST",
    body: source,
  });

  const reader = res.body?.getReader();

  if (reader) {
    return streamedResponse(reader, onProgress);
  } else {
    return false;
  }
}

export async function translate(transcription, resultLanguage, onProgress) {
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
