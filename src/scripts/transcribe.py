import os
import openai
import sys
openai.api_key = os.getenv("OPENAI_API_KEY")
video_id = sys.argv[1]
result_type = sys.argv[2]

audio_file_path = os.path.join(os.getcwd(), 'tmp', video_id + '.m4a')

audio_file = open(audio_file_path, "rb")
transcript = openai.Audio.transcribe(
  file=audio_file,
  model="whisper-1",
  response_format=result_type,
#   prompt=(
#       'I am trying to transcribe this audio'
#   )
)

print(transcript)