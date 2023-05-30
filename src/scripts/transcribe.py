import os
import openai
import sys

openai.api_key = os.getenv("OPENAI_API_KEY")
source_name = sys.argv[1]
result_type = sys.argv[2]
audio_source = sys.argv[3]

if audio_source == "youtube": 
    audio_file_path = os.path.join(os.getcwd(), 'tmp', source_name + '.m4a')
elif audio_source == "audio":
    audio_file_path = os.path.join(os.getcwd(), 'tmp', source_name)

audio_file = open(audio_file_path, "rb")
transcript = openai.Audio.transcribe(
  file=audio_file,
  model="whisper-1",
  response_format=result_type,
#   prompt=(
#       'I am trying to transcribe this audio'
#   )
)



print(transcript, flush=True)

 