export function extractVideoIdFromLink(url) {
  // return the v parameter of the youtube url, that is the video id
  return new URL(url).searchParams.get("v");
}

export async function processSource(source, resultType, resultLanguage) {
  let transcription = "";

  if (typeof source === "string") {
    await downloadAudioFromVideo(source);
    transcription = await transcribeAudioFromVideo(source, resultType);
  } else {
    await uploadAudio(source);
    transcription = await transcribeAudioFromAudio(source, resultType);
  }

  // if it was possible to get the transcription of the audio"
  if (transcription) {
    // if translation is requested, then translate
    if (resultLanguage !== "no translation") {
      const translatedTranscription = await translate(
        transcription,
        resultLanguage
      );

      if (translatedTranscription) {
        return translatedTranscription;
      }

      return "There was an error while processing your source. Please try again at a later time";
    } else {
      // if no translation requested, return the transcription
      return transcription;
    }
  }

  return "There was an error while processing your source. Please try again at a later time";
}

export async function downloadAudioFromVideo(videoId) {
  // calling the API (backend) to get the audio
  const res = await fetch(
    `/api/download/youtube/audio?${new URLSearchParams({
      video_id: videoId,
    })}`
  );

  if (res.ok) {
    const reader = res.body?.getReader();

    if (reader) {
      return streamedResponse(reader);
    }
  }
  return false;
}

export async function uploadAudio(source) {
  const res = await fetch("/api/upload/audio", {
    method: "POST",
    body: source,
  });

  if (res.ok) {
    const reader = res.body?.getReader();

    if (reader) {
      return streamedResponse(reader);
    }
  }
  return false;
}

export async function transcribeAudioFromVideo(source, resultType) {
  const res = await fetch(
    `/api/transcript/youtube?${new URLSearchParams({
      source,
      resultType,
    })}`,
    {}
  );

  if (res.ok) {
    const reader = res.body?.getReader();

    if (reader) {
      return streamedResponse(reader);
    }
  }
  return false;
}

export async function transcribeAudioFromAudio(source, resultType) {
  source.append("resultType", resultType);

  const res = await fetch("/api/transcript/audio", {
    method: "POST",
    body: source,
  });

  if (res.ok) {
    const reader = res.body?.getReader();

    if (reader) {
      return streamedResponse(reader);
    }
  }
  return false;
}

export async function translate(transcription, resultLanguage) {
  const data = { transcription, resultLanguage };

  const res = await fetch(`/api/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const reader = res.body?.getReader();

    if (reader) {
      return streamedResponse(reader);
    }
  }
  return false;
}

// function that get the object reader and read/decode it in chunks
// to display in the web page
async function streamedResponse(reader) {
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

      reader.read().then(readChunk);
    };

    reader.read().then(readChunk);
  });
}

export async function sendEmail(email, output) {
  const data = { email, output };

  try {
    const res = await fetch("/api/send/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      console.log("Email sent successfully");
    } else {
      console.log("Error sending email", res);
    }
  } catch (error) {
    console.log("Error sending meail: ", error);
  }
}
