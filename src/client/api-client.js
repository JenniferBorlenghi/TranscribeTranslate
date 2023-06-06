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

  // console.log("transcription", transcription);

  // if it was possible to get the transcription of the audio"
  if (!transcription.error) {
    // if translation is requested, then translate
    if (resultLanguage !== "no translation") {
      const translatedTranscription = await translate(
        transcription,
        resultLanguage
      );

      if (translatedTranscription) {
        return translatedTranscription;
      }
    } else {
      // if no translation requested, return the transcription
      return transcription;
    }
  }

  return "An error occurred while processing your request. Please review the input you provided and try again.";
}

export async function downloadAudioFromVideo(videoId) {
  // calling the API (backend) to get the audio
  const res = await fetch(
    `/api/download/youtube/audio?${new URLSearchParams({
      video_id: videoId,
    })}`
  );

  if (!res.ok) {
    return false;
  }
}

export async function uploadAudio(source) {
  const res = await fetch("/api/upload/audio", {
    method: "POST",
    body: source,
  });

  if (!res.ok) {
    return false;
  }
}

export async function transcribeAudioFromVideo(source, resultType) {
  const res = await fetch(
    `/api/transcript/youtube?${new URLSearchParams({
      source,
      resultType,
    })}`,
    {}
  );
  const transcribedAudio = await res.json();

  if (res.ok) {
    console.log("Transcribed Audio: ", transcribedAudio.result);
    const result = transcribedAudio.result;

    return result;
  }
  return transcribedAudio;
}

export async function transcribeAudioFromAudio(source, resultType) {
  source.append("resultType", resultType);
  // console.log("source test", source);

  const res = await fetch("/api/transcript/audio", {
    method: "POST",
    body: source,
  });

  const transcribedAudio = await res.json();

  if (res.ok) {
    console.log("Transcribed Audio: ", transcribedAudio.result);
    const result = transcribedAudio.result;

    return result;
  }
  return transcribedAudio;
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

  const translatedTranscription = await res.json();

  if (res.ok) {
    const result = translatedTranscription.result;
    console.log("Translated Transcription:", translatedTranscription.result);

    return result;
  }
  return translatedTranscription;
}

export async function sendEmail(email, output) {
  const data = { email, output };

  const res = await fetch("/api/send/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error sending email");
    return false;
  }
}
